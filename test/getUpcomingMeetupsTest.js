const expect = require('chai').expect;
const nock = require('nock');

const getUpcomingMeetups = require('../src/getUpcomingMeetups');

describe('getUpcomingMeetups', () => {
  it('returns all upcoming meetups', (done) => {
    const meetupName = 'sydney-node-ninjas';
    const token = { key: 'SECRET' };

    nock('https://api.meetup.com/')
      .get(`/${meetupName}/events`)
      .query({ key: token.key, status: 'upcoming', page: 1 })
      .reply(200, [{
        name: 'Sydney Node Ninjas @ Mi9',
        venue: {
          name: 'MI9 Office',
        },
        link: 'https://www.meetup.com/sydney-node-ninjas/meetups/231588486/',
      }]);

    getUpcomingMeetups(meetupName, token).then((upcomingMeetups) => {
      expect(upcomingMeetups).to.eql([
        'Sydney Node Ninjas @ Mi9 at MI9 Office - https://www.meetup.com/sydney-node-ninjas/meetups/231588486/',
      ]);
    }).then(done).catch(err => done(err));
  });
});
