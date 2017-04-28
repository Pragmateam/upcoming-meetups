const meetupAPI = require('./meetupAPI');
const moment = require('moment-timezone');

class Meetup {
  constructor(meetup) {
    this.meetup = meetup;
  }

  get name() { return this.meetup.name; }

  get time() {
    const startTime = moment(this.meetup.time).tz('Australia/Sydney')
      .format('MMMM D, h:mm A');

    const endTime = moment(this.meetup.time).tz('Australia/Sydney')
      .add(this.meetup.duration, 'milliseconds')
      .format('h:mm A');

    return `${startTime} to ${endTime}`;
  }

  get venue() { return this.meetup.venue.name; }
  get link() { return this.meetup.link; }

  toString() {
    return `${this.name} - ${this.time} - ${this.link}`;
  }
}

const getUpcomingMeetups = (meetups, token) => {
  const promises = meetups
    .map(meetupName => meetupAPI.upcomingMeetup(meetupName, token));

  const requests = Promise.all(promises)
    .then(response => response.map(meetup => new Meetup(meetup)));

  return Promise.resolve(requests)
    .then(resolvedRequest => resolvedRequest.map(meetup => meetup.toString()));
};

module.exports = getUpcomingMeetups;
