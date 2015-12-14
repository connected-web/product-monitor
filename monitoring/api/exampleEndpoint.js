var instance = function () {}

var server = false;

instance.route = '/api/exampleEndpoint/:name';
instance.cacheDuration = '1 hour';
instance.description = 'An example endpoint to act as a template for creating your own.'

instance.configure = function (config) {
  server = config.server;
}

instance.render = function (req, res) {
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