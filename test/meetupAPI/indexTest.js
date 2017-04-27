const chai = require('chai');
const meetupAPI = require('../../src/meetupAPI');

const expect = chai.expect;
chai.use(require('chai-string'));

describe('meetupAPI', () => {
  const TOKEN = { key: 'SECRET' };

  describe('#composeUrl', () => {
    const BASE_PATH = 'https://api.meetup.com';

    it('returns composed url', () => {
      expect(meetupAPI.composeUrl('node-girls', TOKEN))
        .to.startsWith(`${BASE_PATH}/node-girls/events`);
    });

    it('returns composed url with default query strings, such as: key, status, page and fields', () => {
      const fields = ['name', 'venue', 'link'];

      expect(meetupAPI.composeUrl('node-girls', TOKEN))
        .to.endsWith(`?key=SECRET&status=upcoming&page=1&only=${fields.join('%2C')}`);
    });
  });
});
