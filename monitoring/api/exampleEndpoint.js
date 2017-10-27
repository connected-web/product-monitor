const endpoint = {}

endpoint.route = '/api/exampleEndpoint/:name'
endpoint.cacheDuration = '1 hour'
endpoint.description = 'An example endpoint to act as a template for creating your own.'

endpoint.configure = function (config) {}

endpoint.render = function (req, res) {
  // Read parameter from route
  const name = req.params.name || false

  // Form response
  const data = {
    suppliedName: name
  }

  // Send response
  res.jsonp(data)
}

module.exports = endpoint
