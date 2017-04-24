const ApiBuilder = require('claudia-api-builder');

const api = new ApiBuilder();

module.exports = api;

api.get('/upcoming-events', (request) => {
  return 'Hello World';
}, { success: { contentType: 'text/plain' } });
