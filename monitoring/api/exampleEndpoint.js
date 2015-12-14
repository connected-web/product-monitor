var endpoint = function () {}

var server = false;

endpoint.route = '/api/exampleEndpoint/:name';
endpoint.cacheDuration = '1 hour';
endpoint.description = 'An example endpoint to act as a template for creating your own.'

endpoint.configure = function (config) {
  server = config.server;
}

endpoint.render = function (req, res) {
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

module.exports = endpoint;