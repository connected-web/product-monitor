var serverDetails = require('../monitor/serverDetails');

var endpoint = function() {}

endpoint.route = '/api/monitorStatus';
endpoint.cacheDuration = '10 seconds';
endpoint.description = 'Reports the uptime of the server, and the unique serverHash generated when the endpoint started.';

endpoint.configure = function(config) {}

endpoint.render = function(req, res) {
  var response = serverDetails.get();
  response.monitorHash = response.serverHash;

  res.jsonp(response);
}

module.exports = endpoint;
