var endpoint = function () {}

var apicacheInstance = false
var apicache = false

endpoint.routes = ['/api/cache/index']
endpoint.description = 'Provides debug information about the API cache layer. Only active when config.apiCache.debug is set to true.'
endpoint.cacheDuration = '10 seconds'
endpoint.rolesRequired = ['administrator']

endpoint.configure = function (config) {
  apicacheInstance = config.apiCache
  apicache = config.apicacheInstance
}

endpoint.render = function (req, res) {
  var index = (apicache) ? apicache.getIndex() : {}

  res.send({
    index: index,
    cacheDuration: endpoint.cacheDuration,
    error: !apicacheInstance.debug,
    message: 'This endpoint only functions correctly when config.apiCache.debug is set to true.'
  })
}

module.exports = endpoint
