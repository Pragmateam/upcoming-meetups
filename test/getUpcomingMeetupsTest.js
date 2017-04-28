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
      venue: {
        name: faker.address.streetAddress(),
      },
      link: faker.internet.url(),
    };

    meetupAPI.upcomingMeetup
      .withArgs(meetup.name, TOKEN)
      .returns(Promise.resolve(meetup));

    getUpcomingMeetups([meetup.name], TOKEN).then((upcomingMeetups) => {
      expect(upcomingMeetups).to.eql([
        `${meetup.name} at ${meetup.venue.name} - ${meetup.link}`,
      ]);
    }).then(done).catch(err => done(err));
  });

  it('returns multiple upcoming meetups', (done) => {
    const someMeetup = {
      name: generateFakeEventName(),
      venue: faker.address.streetAddress(),
      link: faker.internet.url(),
    };

    const anotherMeetup = {
      name: generateFakeEventName(),
      venue: faker.address.streetAddress(),
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
        `${someMeetup.name} at ${someMeetup.venue.name} - ${someMeetup.link}`,
        `${anotherMeetup.name} at ${anotherMeetup.venue.name} - ${anotherMeetup.link}`,
      ]);
    }).then(done).catch(err => done(err));
  });
});
