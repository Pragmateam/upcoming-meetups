const expect = require('chai').expect;
const nock = require('nock');
const faker = require('faker');

const getUpcomingMeetups = require('../src/getUpcomingMeetups');

describe('getUpcomingMeetups', () => {
  const token = { key: 'SECRET' };
  const params = {
    key: token.key,
    status: 'upcoming',
    page: 1,
    only: 'name,venue,link',
  };

  it('returns the next upcoming meetup', (done) => {
    const meetup = {
      name: faker.hacker.adjective(),
      venue: faker.address.streetAddress(),
      link: faker.internet.url(),
    };

    nock('https://api.meetup.com/')
      .get(`/${meetup.name}/events`)
      .query(params)
      .reply(200, [{
        name: meetup.name,
        venue: {
          name: meetup.venue,
        },
        link: meetup.link,
      }]);

    getUpcomingMeetups([meetup.name], token).then((upcomingMeetups) => {
      expect(upcomingMeetups).to.eql([
        `${meetup.name} at ${meetup.venue} - ${meetup.link}`,
      ]);
    }).then(done).catch(err => done(err));
  });

  it('returns all upcoming meetups', (done) => {
    const someMeetup = {
      name: faker.hacker.adjective(),
      venue: faker.address.streetAddress(),
      link: faker.internet.url(),
    };

    const anotherMeetup = {
      name: faker.hacker.adjective(),
      venue: faker.address.streetAddress(),
      link: faker.internet.url(),
    };

    nock('https://api.meetup.com/')
      .get(`/${someMeetup.name}/events`)
      .query(params)
      .reply(200, [{
        name: someMeetup.name,
        venue: {
          name: someMeetup.venue,
        },
        link: someMeetup.link,
      }]);

    nock('https://api.meetup.com/')
      .get(`/${anotherMeetup.name}/events`)
      .query(params)
      .reply(200, [{
        name: anotherMeetup.name,
        venue: {
          name: anotherMeetup.venue,
        },
        link: anotherMeetup.link,
      }]);

    getUpcomingMeetups([someMeetup.name, anotherMeetup.name], token).then((upcomingMeetups) => {
      expect(upcomingMeetups).to.eql([
        `${someMeetup.name} at ${someMeetup.venue} - ${someMeetup.link}`,
        `${anotherMeetup.name} at ${anotherMeetup.venue} - ${anotherMeetup.link}`,
      ]);
    }).then(done).catch(err => done(err));
  });
});
