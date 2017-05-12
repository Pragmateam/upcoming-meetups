const chai = require('chai');
const nock = require('nock');
const api = require('../../../src/meetup/api');

const expect = chai.expect;
chai.use(require('chai-string'));

describe('api', () => {
  const TOKEN = { key: 'SECRET' };

  describe('#upcomingMeetup', () => {
    const MEETUP_API = 'https://api.meetup.com/';

    const PARAMS = {
      key: TOKEN.key,
      status: 'upcoming',
      page: 1,
      only: 'name,time,duration,link,venue,group',
    };

    it('returns the next upcoming meetup', (done) => {
      const meetup = 'foo';

      nock(MEETUP_API)
        .get(`/${meetup.name}/events`)
        .query(PARAMS)
        .reply(200, [meetup]);

      api.upcomingMeetup(meetup.name, TOKEN).then((upcomingMeetup) => {
        expect(upcomingMeetup).to.eql(meetup);
      }).then(done).catch(err => done(err));
    });
  });
});
