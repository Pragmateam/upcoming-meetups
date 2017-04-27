const axios = require('axios');
const querystring = require('querystring');

function composeUrl(meetupName, token) {
  const basePath = 'https://api.meetup.com';
  const params = querystring.stringify({
    key: token.key,
    status: 'upcoming',
    page: 1,
  });

  return `${basePath}/${meetupName}/events?${params}`;
}

class Meetup {
  constructor(meetup) {
    this.meetup = meetup;
  }

  get name() { return this.meetup.name; }
  get venue() { return this.meetup.venue.name; }
  get link() { return this.meetup.link; }

  toString() {
    return `${this.name} at ${this.venue} - ${this.link}`;
  }
}

const getUpcomingMeetups = (meetupName, token) => {
  const promisedRequest = axios.get(composeUrl(meetupName, token))
    .then(response => response.data.map(meetup => new Meetup(meetup).toString()));

  return Promise.resolve(promisedRequest);
};

module.exports = getUpcomingMeetups;
