const httpGet = require('got');
const querystring = require('querystring');

function composeUrl(meetupName, token) {
  const basePath = 'https://api.meetup.com';
  const params = querystring.stringify({
    key: token.key,
    status: 'upcoming',
    page: 1,
    only: 'name,venue,link',
  });

  return `${basePath}/${meetupName}/events?${params}`;
}

module.exports = class MeetupAPI {
  static upcomingMeetup(meetupName, token) {
    return httpGet.get(composeUrl(meetupName, token))
      .then(response => JSON.parse(response.body))
      .then(upcomingMeetups => upcomingMeetups[0]);
  }
};
