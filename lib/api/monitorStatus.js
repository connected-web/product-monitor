var instance = function() {}
var md5 = require('md5-node');

var bootTime = Date.now();
var monitorHash = md5(bootTime);

instance.route = "/api/monitorStatus";

instance.configure = function(config) {}

instance.render = function(req, res) {
  var currentTime = Date.now();
  var serverAgeInSeconds = Math.floor((currentTime - bootTime) / 1000);

  var response = {
    bootTime: bootTime,
    currentTime: Date.now(),
    serverAgeInSeconds: serverAgeInSeconds,
    monitorHash: monitorHash
  };

  res.jsonp(response);
}

module.exports = instance;
