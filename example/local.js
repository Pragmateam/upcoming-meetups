const api = require('../index');

const apiRequest = {
  context: {
    path: '/upcoming-events',
    method: 'GET'
  }
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
