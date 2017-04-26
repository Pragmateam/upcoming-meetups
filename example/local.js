const api = require('../index');

const args = process.argv.slice(2);
const meetupNameFromCommandLine = args[args.length - 1];

const apiRequest = {
  context: {
    path: '/upcoming-meetups',
    method: 'GET',
  },
  queryString: {
    name: meetupNameFromCommandLine,
  },
};

api.proxyRouter(apiRequest, {
  done: (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log(data.body);
  }
});
