const ApiBuilder = require('claudia-api-builder');
const getUpcomingMeetups = require('./src/getUpcomingMeetups');

const api = new ApiBuilder();

module.exports = api;

api.get('/upcoming-meetups', (request) => {
  const meetupName = request.queryString.name;
  const token = { key: process.env.MEETUP_API_KEY };

  return getUpcomingMeetups(meetupName, token).then((response) => {
    return response;
  }).catch(err => console.error(err));
}, { success: { contentType: 'text/plain' } });
