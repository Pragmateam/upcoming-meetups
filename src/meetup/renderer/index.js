const moment = require('moment-timezone');

class Meetup {
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
    const venue = this.meetup.venue || { localized_country_name: '', city: '' };
    const zoneName = `${venue.localized_country_name}/${venue.city}`;
    const zoneNames = moment.tz.names();

    return zoneNames.find(zone => zone === zoneName) || 'Australia/Sydney';
  }

  get startTime() {
    return moment(this.meetup.time).tz(this.timezone);
  }

  get endTime() {
    return this.startTime.add(this.meetup.duration, 'milliseconds');
  }

  get formattedTimeRange() {
    const startTime = this.startTime.format('MMMM D, h:mm A');
    const endTime = this.endTime.format('h:mm A');

    return `${startTime} to ${endTime}`;
  }

  get url() {
    return this.meetup.link;
  }
}

class MeetupRenderer {
  static render(meetupToBeRendered) {
    const meetup = new Meetup(meetupToBeRendered);

    return `> *${meetup.groupName}* :: ${meetup.name} - ${meetup.formattedTimeRange} - ${meetup.url}`;
  }
}

module.exports = MeetupRenderer;
