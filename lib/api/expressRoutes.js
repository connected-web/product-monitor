var instance = function() {}

var server = false;

instance.route = '/api/expressRoutes';
instance.description = 'Returns the Express router stack as raw JSON. Can be used to discover routes available from the server.'

instance.configure = function(config) {
  server = config.server;
}

instance.render = function(req, res) {
  var data = false;

  if(server && server._router) {
    data = {
      routes: server._router.stack,
      timestamp: Date.now()
    };
  }
  else {
    data = {
      error: 'No server configured, no route information available.'
    }
  }

  res.send(data);
}

module.exports = instance;
