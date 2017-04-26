const api = require('../index');
const args = process.argv.slice(2);
const eventNameFromCommandLine = args[args.length - 1];

const apiRequest = {
  context: {
    path: '/upcoming-events',
    method: 'GET',
  },
  queryString: {
    name: eventNameFromCommandLine,
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
