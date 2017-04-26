const https = require('https');
const querystring = require('querystring');

function composeUrl(eventName, token) {
  const basePath = 'https://api.meetup.com';
  const params = querystring.stringify({
    key: token.key,
    status: 'upcoming',
    page: 1,
  });

  return `${basePath}/${eventName}/events?${params}`;
}

function httpGet(url) {
  return new Promise((resolve) => {
    const request = https.get(url, (response) => {
      response.setEncoding('utf8');

      response.on('data', data => resolve(JSON.parse(data)));
    });

    request.end();
  });
}

const getUpcomingEvents = (eventName, token) => {
  const promisedRequest = httpGet(composeUrl(eventName, token))
    .then(response => response.map(event => event.name));

  return Promise.resolve(promisedRequest);
};

module.exports = getUpcomingEvents;
