var serverLog = require('../monitor/serverLog');
var instance = function() {}

var server = false;

instance.route = "/api/serverLog";

instance.configure = function(config) {

}

instance.render = function(req, res) {
  var data = false;

  data = {
    lines: serverLog.log,
    timestamp: Date.now()
  };

  res.send(data);
}

module.exports = instance;
