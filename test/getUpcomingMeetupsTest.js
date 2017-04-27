const expect = require('chai').expect;
const nock = require('nock');
const faker = require('faker');

const getUpcomingMeetups = require('../src/getUpcomingMeetups');

describe('getUpcomingMeetups', () => {
  it('returns all upcoming meetups', (done) => {
    const meetup = {
      name: faker.company.companySuffix(),
      venue: faker.address.streetAddress(),
      link: faker.internet.url(),
    };

    const token = { key: 'SECRET' };

    nock('https://api.meetup.com/')
      .get(`/${meetup.name}/events`)
      .query({ key: token.key, status: 'upcoming', page: 1 })
      .reply(200, [{
        name: meetup.name,
        venue: {
          name: meetup.venue,
        },
        link: meetup.link,
      }]);

    getUpcomingMeetups(meetup.name, token).then((upcomingMeetups) => {
      expect(upcomingMeetups).to.eql([
        `${meetup.name} at ${meetup.venue} - ${meetup.link}`,
      ]);
    }).then(done).catch(err => done(err));
  });
});
