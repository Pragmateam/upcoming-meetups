const meetupAPI = require('./meetupAPI');
const moment = require('moment-timezone');

class Meetup {
  constructor(meetup) {
    this.meetup = meetup;
  }

  get name() {
    return this.meetup.name;
  }

  get localizedCountryName() {
    return this.meetup.venue.localized_country_name;
  }

  get city() {
    return this.meetup.venue.city;
  }

  get time() {
    const timezone = `${this.localizedCountryName}/${this.city}`;
    const startTime = moment(this.meetup.time).tz(timezone)
      .format('MMMM D, h:mm A');

    const endTime = moment(this.meetup.time).tz(timezone)
      .add(this.meetup.duration, 'milliseconds')
      .format('h:mm A');

    return `${startTime} to ${endTime}`;
  }

  get link() {
    return this.meetup.link;
  }

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
