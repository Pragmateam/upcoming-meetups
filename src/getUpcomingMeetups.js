const https = require('https');
const meetupAPI = require('./meetupAPI');

function httpGet(url) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, (response) => {
      response.setEncoding('utf8');

      response.on('data', data => resolve(JSON.parse(data)));
    });

    request.on('error', error => reject(error));
    request.end();
  });
}

function flattenOneLevelDeep(arr) {
  return Array.prototype.concat(...arr);
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

const getUpcomingMeetups = (meetups, token) => {
  const meetupUrls = meetups.map(meetupName => meetupAPI.composeUrl(meetupName, token));
  const promises = meetupUrls.map(url => httpGet(url));

  const requests = Promise.all(promises)
    .then(promise => flattenOneLevelDeep(promise))
    .then(response => response.map(meetup => new Meetup(meetup)));

  return Promise.resolve(requests)
    .then(resolvedRequest => resolvedRequest.map(meetup => meetup.toString()));
};

module.exports = getUpcomingMeetups;
