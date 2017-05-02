const expect = require('chai').expect;
const faker = require('faker');
const sinon = require('sinon');

const meetupAPI = require('../src/meetupAPI');
const getUpcomingMeetups = require('../src/getUpcomingMeetups');

describe('getUpcomingMeetups', () => {
  const TOKEN = { key: 'SECRET' };
  const sandbox = sinon.sandbox.create();

  beforeEach(() => sandbox.stub(meetupAPI, 'upcomingMeetup'));
  afterEach(() => sandbox.restore());

  it('returns the next upcoming meetup', (done) => {
    const meetup = {
      name: faker.hacker.adjective(),
      time: 1493884800000,
      duration: 10800000,
      venue: {
        city: 'Sydney',
        localized_country_name: 'Australia',
      },
      group: {
        name: faker.hacker.noun(),
      },
      link: faker.internet.url(),
    };

    meetupAPI.upcomingMeetup
      .withArgs(meetup.group.name, TOKEN)
      .returns(Promise.resolve(meetup));

    getUpcomingMeetups([meetup.group.name], TOKEN).then((upcomingMeetups) => {
      expect(upcomingMeetups).to.eql([
        `*${meetup.group.name}* :: ${meetup.name} - May 4, 6:00 PM to 9:00 PM - ${meetup.link}`,
      ]);
    }).then(done).catch(err => done(err));
  });

  it('returns multiple upcoming meetups', (done) => {
    const someMeetup = {
      name: faker.hacker.adjective(),
      time: 1493884800000,
      duration: 10800000,
      venue: {
        city: 'Sydney',
        localized_country_name: 'Australia',
      },
      group: {
        name: faker.hacker.noun(),
      },
      link: faker.internet.url(),
    };

    const anotherMeetup = {
      name: faker.hacker.adjective(),
      time: 1493884800000,
      duration: 5400000,
      venue: {
        city: 'Sydney',
        localized_country_name: 'Australia',
      },
      group: {
        name: faker.hacker.noun(),
      },
      link: faker.internet.url(),
    };

    meetupAPI.upcomingMeetup
      .withArgs(someMeetup.group.name, TOKEN)
      .returns(Promise.resolve(someMeetup));

    meetupAPI.upcomingMeetup
      .withArgs(anotherMeetup.group.name, TOKEN)
      .returns(Promise.resolve(anotherMeetup));

    const wantedMeetups = [someMeetup.group.name, anotherMeetup.group.name];

    getUpcomingMeetups(wantedMeetups, TOKEN).then((upcomingMeetups) => {
      expect(upcomingMeetups).to.eql([
        `*${someMeetup.group.name}* :: ${someMeetup.name} - May 4, 6:00 PM to 9:00 PM - ${someMeetup.link}`,
        `*${anotherMeetup.group.name}* :: ${anotherMeetup.name} - May 4, 6:00 PM to 7:30 PM - ${anotherMeetup.link}`,
      ]);
    }).then(done).catch(err => done(err));
  });

  it('sorts upcoming meetups by time, returning the upcoming first', (done) => {
    const firstMeetup = {
      name: faker.hacker.adjective(),
      time: new Date('2017-06-02T06:00:00+10:00'),
      duration: 5400000,
      group: {
        name: faker.hacker.noun(),
      },
      link: faker.internet.url(),
    };

    const secondMeetup = {
      name: faker.hacker.adjective(),
      time: new Date('2017-06-02T06:30:00+10:00'),
      duration: 5400000,
      group: {
        name: faker.hacker.noun(),
      },
      link: faker.internet.url(),
    };

    const thirdMeetup = {
      name: faker.hacker.adjective(),
      time: new Date('2017-06-02T07:00:00+10:00'),
      duration: 5400000,
      group: {
        name: faker.hacker.noun(),
      },
      link: faker.internet.url(),
    };

    meetupAPI.upcomingMeetup
      .withArgs(firstMeetup.group.name, TOKEN)
      .returns(Promise.resolve(firstMeetup));

    meetupAPI.upcomingMeetup
      .withArgs(secondMeetup.group.name, TOKEN)
      .returns(Promise.resolve(secondMeetup));

    meetupAPI.upcomingMeetup
      .withArgs(thirdMeetup.group.name, TOKEN)
      .returns(Promise.resolve(thirdMeetup));

    const unorderedMeetups = [
      thirdMeetup.group.name,
      firstMeetup.group.name,
      secondMeetup.group.name,
    ];

    getUpcomingMeetups(unorderedMeetups, TOKEN).then((upcomingMeetups) => {
      expect(upcomingMeetups).to.eql([
        `*${firstMeetup.group.name}* :: ${firstMeetup.name} - June 2, 6:00 AM to 7:30 AM - ${firstMeetup.link}`,
        `*${secondMeetup.group.name}* :: ${secondMeetup.name} - June 2, 6:30 AM to 8:00 AM - ${secondMeetup.link}`,
        `*${thirdMeetup.group.name}* :: ${thirdMeetup.name} - June 2, 7:00 AM to 8:30 AM - ${thirdMeetup.link}`,
      ]);
    }).then(done).catch(err => done(err));
  });

  it('ignores malformed meetups from API', (done) => {
    const meetup = {
      name: faker.hacker.adjective(),
      time: 1493884800000,
      duration: 10800000,
      venue: {
        city: 'Sydney',
        localized_country_name: 'Australia',
      },
      group: {
        name: faker.hacker.noun(),
      },
      link: faker.internet.url(),
    };

    const malformedMeetup = undefined;

    meetupAPI.upcomingMeetup
      .withArgs(meetup.group.name, TOKEN)
      .returns(Promise.resolve(meetup));

    meetupAPI.upcomingMeetup
      .withArgs(undefined, TOKEN)
      .returns(Promise.resolve(malformedMeetup));

    getUpcomingMeetups([meetup.group.name, undefined], TOKEN).then((upcomingMeetups) => {
      expect(upcomingMeetups).to.eql([
        `*${meetup.group.name}* :: ${meetup.name} - May 4, 6:00 PM to 9:00 PM - ${meetup.link}`,
      ]);
    }).then(done).catch(err => done(err));
  });

  it('calculates times for different timezones', (done) => {
    const meetup = {
      name: faker.hacker.adjective(),
      time: 1493884800000,
      duration: 10800000,
      venue: {
        city: 'Tokyo',
        localized_country_name: 'Asia',
      },
      group: {
        name: faker.hacker.noun(),
      },
      link: faker.internet.url(),
    };

    meetupAPI.upcomingMeetup
      .withArgs(meetup.group.name, TOKEN)
      .returns(Promise.resolve(meetup));

    getUpcomingMeetups([meetup.group.name], TOKEN).then((upcomingMeetups) => {
      expect(upcomingMeetups).to.eql([
        `*${meetup.group.name}* :: ${meetup.name} - May 4, 5:00 PM to 8:00 PM - ${meetup.link}`,
      ]);
    }).then(done).catch(err => done(err));
  });

  it('uses Australia/Sydney timezone by default when locale is missing', (done) => {
    const meetup = {
      name: faker.hacker.adjective(),
      time: 1493884800000,
      duration: 10800000,
      group: {
        name: faker.hacker.noun(),
      },
      link: faker.internet.url(),
    };

    meetupAPI.upcomingMeetup
      .withArgs(meetup.group.name, TOKEN)
      .returns(Promise.resolve(meetup));

    getUpcomingMeetups([meetup.group.name], TOKEN).then((upcomingMeetups) => {
      expect(upcomingMeetups).to.eql([
        `*${meetup.group.name}* :: ${meetup.name} - May 4, 6:00 PM to 9:00 PM - ${meetup.link}`,
      ]);
    }).then(done).catch(err => done(err));
  });
});
