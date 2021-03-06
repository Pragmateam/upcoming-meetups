const api = require('./meetup/api');
const renderer = require('./meetup/renderer');

function onlyValid(x) {
  return x.meetup !== undefined;
}

function render(meetup) {
  return renderer.render(meetup);
}

const getUpcomingMeetups = (meetups, token) => {
  const promises = meetups
    .map(meetupName => api.upcomingMeetup(meetupName, token));

  return Promise.all(promises)
    .then(response => response.filter(onlyValid))
    .then((response) => {
      return response.sort((a, b) => a.startTime - b.startTime).map(render);
    });
};

module.exports = getUpcomingMeetups;
