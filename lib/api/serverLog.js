var serverLog = require('../monitor/serverLog');
var instance = function() {}

var server = false;

instance.routes = ["/api/serverLog", "/api/serverLog/:lines", "/api/serverLog/:lines/:order"];
instance.cacheDuration = "3 seconds";

instance.configure = function(config) {

}

instance.render = function(req, res) {
  var data = false;

  var lineLimit = req.params.lines || 0;
  var order = req.params.order || 'descending'
  var log = serverLog.log;

  if(lineLimit > 0) {
    log = log.slice(-lineLimit);
  }

  if(order == 'descending') {
    log.reverse();
  }

  data = {
    lineLimit: lineLimit,
    lines: log,
    timestamp: Date.now()
  };

  res.send(data);
}

module.exports = instance;
