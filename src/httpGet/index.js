const https = require('https');

const httpGet = url => new Promise((resolve, reject) => {
  const request = https.get(url, (response) => {
    response.setEncoding('utf8');

    response.on('data', data => resolve(JSON.parse(data)));
  });

  request.on('error', error => reject(error));
  request.end();
});

module.exports = httpGet;
