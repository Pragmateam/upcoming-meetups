const expect = require('chai').expect;
const nock = require('nock');

const getUpcomingEvents = require('../src/getUpcomingEvents');

describe('getUpcomingEvents', () => {
  it('returns all upcoming events', (done) => {
    const eventName = 'sydney-node-ninjas';
    const token = { key: 'SECRET' };

    nock('https://api.meetup.com/')
      .get(`/${eventName}/events`)
      .query({ key: token.key, status: 'upcoming', page: 1 })
      .reply(200, [{
        name: 'Sydney Node Ninjas @ Mi9',
        status: 'upcoming',
        time: 1493884800000,
        utc_offset: 36000000,
        venue: {
          name: 'MI9 Office',
          lat: -33.86494064331055,
          lon: 151.20794677734375,
          address_1: '264 George St, Sydney NSW 2000',
          city: 'Sydney',
          country: 'au',
          localized_country_name: 'Australia',
        },
        link: 'https://www.meetup.com/sydney-node-ninjas/events/231588486/',
        description: 'This event will be awesome!',
      }]);

    getUpcomingEvents(eventName, token).then((upcomingEvents) => {
      expect(upcomingEvents).to.eql(['Sydney Node Ninjas @ Mi9']);
    }).then(done).catch(err => done(err));
  });
});
