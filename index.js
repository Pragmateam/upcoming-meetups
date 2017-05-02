const ApiBuilder = require('claudia-api-builder');
const getUpcomingMeetups = require('./src/getUpcomingMeetups');

const api = new ApiBuilder();

module.exports = api;

api.get('/upcoming-meetups', (request) => {
  const meetups = request.queryString.meetups.split(',');
  const token = { key: process.env.MEETUP_API_KEY };

  return getUpcomingMeetups(meetups, token).then((response) => {
    return response.join('\n\n');
  }).catch(err => console.error(err));
}, { success: { contentType: 'text/plain' } });
