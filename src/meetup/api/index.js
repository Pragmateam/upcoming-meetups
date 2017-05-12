const http = require('got');
const querystring = require('querystring');

function composeUrl(meetupName, token) {
  const basePath = 'https://api.meetup.com';
  const params = querystring.stringify({
    key: token.key,
    status: 'upcoming',
    page: 1,
    only: 'name,time,duration,link,venue,group',
  });

  return `${basePath}/${meetupName}/events?${params}`;
}

module.exports = class MeetupAPI {
  static upcomingMeetup(meetupName, token) {
    return http.get(composeUrl(meetupName, token))
      .then(response => JSON.parse(response.body))
      .then(upcomingMeetups => upcomingMeetups[0]);
  }
};
