var endpoint = function () {}

var apiCacheConfig = false;
var apicache = false;

endpoint.routes = ['/api/cache/index'];
endpoint.description = 'Provides debug information about the API cache layer. Only active when config.apiCache.debug is set to true.'
endpoint.cacheDuration = '10 seconds';

endpoint.configure = function (config) {
  apiCacheConfig = config.apiCache;
  apicache = config.apicacheendpoint;
}

endpoint.render = function (req, res) {
  res.send({
    index: apicache.getIndex(),
    cacheDuration: endpoint.cacheDuration,
    error: !apiCacheConfig.debug,
    message: 'This endpoint only functions correctly when config.apiCache.debug is set to true.'
  });
}

module.exports = endpoint;
