const api = require('../index');

const args = process.argv.slice(2);
const meetupNamesFromCommandLine = args[args.length - 1];

const apiRequest = {
  context: {
    path: '/upcoming-meetups',
    method: 'GET',
  },
  queryString: {
    meetups: meetupNamesFromCommandLine,
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
