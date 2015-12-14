var endpoint = function() {}

var server = false;

endpoint.route = '/api/expressRoutes';
endpoint.description = 'Returns the Express router stack as raw JSON. Can be used to discover routes available from the server.'

endpoint.configure = function(config) {
  server = config.server;
}

endpoint.render = function(req, res) {
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

module.exports = endpoint;
