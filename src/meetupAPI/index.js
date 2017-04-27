const querystring = require('querystring');

module.exports = class MeetupAPI {
  static composeUrl(meetupName, token) {
    const basePath = 'https://api.meetup.com';
    const params = querystring.stringify({
      key: token.key,
      status: 'upcoming',
      page: 1,
      only: 'name,venue,link',
    });

    return `${basePath}/${meetupName}/events?${params}`;
  }
};
