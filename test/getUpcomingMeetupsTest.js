const expect = require('chai').expect;
const faker = require('faker');
const sinon = require('sinon');

const meetupAPI = require('../src/meetupAPI');
const getUpcomingMeetups = require('../src/getUpcomingMeetups');

function generateFakeEventName() {
  return faker.hacker.adjective().replace(' ', '-');
}

describe('getUpcomingMeetups', () => {
  const TOKEN = { key: 'SECRET' };
  const sandbox = sinon.sandbox.create();

  beforeEach(() => sandbox.stub(meetupAPI, 'upcomingMeetup'));
  afterEach(() => sandbox.restore());

  it('returns the next upcoming meetup', (done) => {
    const meetup = {
      name: generateFakeEventName(),
      time: 1493884800000,
      duration: 10800000,
      venue: {
        city: 'Sydney',
        localized_country_name: 'Australia',
      },
      link: faker.internet.url(),
    };

    meetupAPI.upcomingMeetup
      .withArgs(meetup.name, TOKEN)
      .returns(Promise.resolve(meetup));

    getUpcomingMeetups([meetup.name], TOKEN).then((upcomingMeetups) => {
      expect(upcomingMeetups).to.eql([
        `${meetup.name} - May 4, 6:00 PM to 9:00 PM - ${meetup.link}`,
      ]);
    }).then(done).catch(err => done(err));
  });

  it('returns multiple upcoming meetups', (done) => {
    const someMeetup = {
      name: generateFakeEventName(),
      time: 1493884800000,
      duration: 10800000,
      venue: {
        city: 'Sydney',
        localized_country_name: 'Australia',
      },
      link: faker.internet.url(),
    };

    const anotherMeetup = {
      name: generateFakeEventName(),
      time: 1493884800000,
      duration: 5400000,
      venue: {
        city: 'Sydney',
        localized_country_name: 'Australia',
      },
      link: faker.internet.url(),
    };

    meetupAPI.upcomingMeetup
      .withArgs(someMeetup.name, TOKEN)
      .returns(Promise.resolve(someMeetup));

    meetupAPI.upcomingMeetup
      .withArgs(anotherMeetup.name, TOKEN)
      .returns(Promise.resolve(anotherMeetup));

    getUpcomingMeetups([someMeetup.name, anotherMeetup.name], TOKEN).then((upcomingMeetups) => {
      expect(upcomingMeetups).to.eql([
        `${someMeetup.name} - May 4, 6:00 PM to 9:00 PM - ${someMeetup.link}`,
        `${anotherMeetup.name} - May 4, 6:00 PM to 7:30 PM - ${anotherMeetup.link}`,
      ]);
    }).then(done).catch(err => done(err));
  });

  it('ignores malformed meetups from API', (done) => {
    const meetup = {
      name: generateFakeEventName(),
      time: 1493884800000,
      duration: 10800000,
      venue: {
        city: 'Sydney',
        localized_country_name: 'Australia',
      },
      link: faker.internet.url(),
    };

    const malformedMeetup = undefined;

    meetupAPI.upcomingMeetup
      .withArgs(meetup.name, TOKEN)
      .returns(Promise.resolve(meetup));

    meetupAPI.upcomingMeetup
      .withArgs(undefined, TOKEN)
      .returns(Promise.resolve(malformedMeetup));

    getUpcomingMeetups([meetup.name, undefined], TOKEN).then((upcomingMeetups) => {
      expect(upcomingMeetups).to.eql([
        `${meetup.name} - May 4, 6:00 PM to 9:00 PM - ${meetup.link}`,
      ]);
    }).then(done).catch(err => done(err));
  });

  it('calculates times for different timezones', (done) => {
    const meetup = {
      name: generateFakeEventName(),
      time: 1493884800000,
      duration: 10800000,
      venue: {
        city: 'Tokyo',
        localized_country_name: 'Asia',
      },
      link: faker.internet.url(),
    };

    meetupAPI.upcomingMeetup
      .withArgs(meetup.name, TOKEN)
      .returns(Promise.resolve(meetup));

    getUpcomingMeetups([meetup.name], TOKEN).then((upcomingMeetups) => {
      expect(upcomingMeetups).to.eql([
        `${meetup.name} - May 4, 5:00 PM to 8:00 PM - ${meetup.link}`,
      ]);
    }).then(done).catch(err => done(err));
  });

  it('uses Australia/Sydney timezone by default when locale is missing', (done) => {
    const meetup = {
      name: generateFakeEventName(),
      time: 1493884800000,
      duration: 10800000,
      link: faker.internet.url(),
    };

    meetupAPI.upcomingMeetup
      .withArgs(meetup.name, TOKEN)
      .returns(Promise.resolve(meetup));

    getUpcomingMeetups([meetup.name], TOKEN).then((upcomingMeetups) => {
      expect(upcomingMeetups).to.eql([
        `${meetup.name} - May 4, 6:00 PM to 9:00 PM - ${meetup.link}`,
      ]);
    }).then(done).catch(err => done(err));
  });
});
