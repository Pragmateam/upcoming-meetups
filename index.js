const ApiBuilder = require('claudia-api-builder');
const getUpcomingEvents = require('./src/getUpcomingEvents');

const api = new ApiBuilder();

module.exports = api;

api.get('/upcoming-events', (request) => {
  const eventName = request.queryString.name;
  const token = { key: process.env.MEETUP_API_KEY };

  return getUpcomingEvents(eventName, token).then((response) => {
    return response;
  }).catch(err => console.error(err));
}, { success: { contentType: 'text/plain' } });
