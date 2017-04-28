const chai = require('chai');
const meetupAPI = require('../../src/meetupAPI');
const nock = require('nock');
const faker = require('faker');

const expect = chai.expect;
chai.use(require('chai-string'));

function generateFakeEventName() {
  return faker.hacker.adjective().replace(' ', '-');
}

describe('meetupAPI', () => {
  const TOKEN = { key: 'SECRET' };

  describe('#upcomingMeetup', () => {
    const MEETUP_API = 'https://api.meetup.com/';

    const PARAMS = {
      key: TOKEN.key,
      status: 'upcoming',
      page: 1,
      only: 'name,venue,link',
    };

    it('returns the next upcoming meetup', (done) => {
      const meetup = {
        name: generateFakeEventName(),
        venue: {
          name: faker.address.streetAddress(),
        },
        link: faker.internet.url(),
      };

      nock(MEETUP_API)
        .get(`/${meetup.name}/events`)
        .query(PARAMS)
        .reply(200, [meetup]);

      meetupAPI.upcomingMeetup(meetup.name, TOKEN).then((upcomingMeetup) => {
        expect(upcomingMeetup).to.eql(meetup);
      }).then(done).catch(err => done(err));
    });
  });
});
