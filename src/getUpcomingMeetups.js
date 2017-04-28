const meetupAPI = require('./meetupAPI');
const Meetup = require('./meetup');

const getUpcomingMeetups = (meetups, token) => {
  const promises = meetups
    .map(meetupName => meetupAPI.upcomingMeetup(meetupName, token));

  const requests = Promise.all(promises)
    .then(response => response.map(meetup => new Meetup(meetup)));

  return Promise.resolve(requests)
    .then(resolvedRequest => resolvedRequest.map(meetup => meetup.toString()));
};

module.exports = getUpcomingMeetups;
