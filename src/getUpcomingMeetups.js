const meetupAPI = require('./meetupAPI');
const meetupRenderer = require('./meetupRenderer');

function onlyValid(x) {
  return x !== undefined;
}

function render(meetup) {
  return meetupRenderer.render(meetup);
}

const getUpcomingMeetups = (meetups, token) => {
  const promises = meetups
    .map(meetupName => meetupAPI.upcomingMeetup(meetupName, token));

  return Promise.all(promises)
    .then(response => response.filter(onlyValid))
    .then((response) => {
      return response.sort((a, b) => a.time - b.time).map(render);
    });
};

module.exports = getUpcomingMeetups;
