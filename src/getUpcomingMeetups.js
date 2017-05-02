const meetupAPI = require('./meetupAPI');
const moment = require('moment-timezone');

class MeetupRenderer {
  constructor(meetup) {
    this.meetup = meetup;
  }

  get groupName() {
    return this.meetup.group.name;
  }

  get name() {
    return this.meetup.name;
  }

  get timezone() {
    return this.meetup.venue ?
      `${this.meetup.venue.localized_country_name}/${this.meetup.venue.city}`
      : 'Australia/Sydney';
  }

  get time() {
    return moment(this.meetup.time).tz(this.timezone);
  }

  get formattedTimeRange() {
    const startTime = this.time.format('MMMM D, h:mm A');

    const endTime = this.time.add(this.meetup.duration, 'milliseconds')
      .format('h:mm A');

    return `${startTime} to ${endTime}`;
  }

  get link() {
    return this.meetup.link;
  }

  render() {
    return `**${this.groupName}** :: ${this.name} - ${this.formattedTimeRange} - ${this.link}`;
  }
}

function onlyValid(x) {
  return x !== undefined;
}

function toMeetup(meetup) {
  return new MeetupRenderer(meetup);
}

const getUpcomingMeetups = (meetups, token) => {
  const promises = meetups
    .map(meetupName => meetupAPI.upcomingMeetup(meetupName, token));

  const requests = Promise.all(promises)
    .then(response => response.filter(onlyValid).map(toMeetup));

  return Promise.resolve(requests)
    .then((resolvedRequest) => {
      return resolvedRequest
        .sort((a, b) => a.time - b.time)
        .map(meetup => meetup.render());
    });
};

module.exports = getUpcomingMeetups;
