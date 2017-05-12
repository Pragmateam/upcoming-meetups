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

  get startTime() {
    const venue = this.meetup.venue || { localized_country_name: '', city: '' };
    const zoneName = `${venue.localized_country_name}/${venue.city}`;
    const zoneNames = moment.tz.names();

    const timezone = zoneNames.find(zone => zone === zoneName) || 'Australia/Sydney';

    return moment(this.meetup.time).tz(timezone);
  }

  get endTime() {
    return this.startTime.add(this.meetup.duration, 'milliseconds');
  }

  get url() {
    return this.meetup.link;
  }
}

module.exports = Meetup;
