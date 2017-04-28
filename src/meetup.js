module.exports = class Meetup {
  constructor(meetup) {
    this.meetup = meetup;
  }

  get name() { return this.meetup.name; }
  get venue() { return this.meetup.venue.name; }
  get link() { return this.meetup.link; }

  toString() {
    return `${this.name} at ${this.venue} - ${this.link}`;
  }
};
