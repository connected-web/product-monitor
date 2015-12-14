var serverDetails = require('../monitor/serverDetails');

var instance = function() {}

instance.route = '/api/monitorStatus';
instance.cacheDuration = '10 seconds';

instance.configure = function(config) {}

instance.render = function(req, res) {
  var response = serverDetails.get();
  response.monitorHash = response.serverHash;

  res.jsonp(response);
}

module.exports = instance;
