var model = require('../../models/routes');

var endpoint = {};

endpoint.route = '/api/monitor/routes';
endpoint.description = 'Returns a data structure that represents all content and api paths that have been registered with the server.';

endpoint.configure = function (config) {}

endpoint.render = function (req, res) {
  var data = {
    routes: model.get(),
    timestamp: Date.now()
  };

  res.jsonp(data);
}

module.exports = endpoint;
