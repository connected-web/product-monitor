var instance = function() {}

var server = false;

instance.route = '/api/exampleEndpoint/:name';

instance.configure = function(config) {
  server = config.server;
}

instance.render = function(req, res) {
  var data = {};

  // read parameter from route
  var name = req.params.name || false;

  // form response
  var data = {
    suppliedName: name
  };

  // send response
  res.jsonp(data);
}

module.exports = instance;
