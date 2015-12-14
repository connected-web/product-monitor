var instance = function () {}

var apiCacheConfig = false;
var apicache = false;

instance.routes = ['/api/cache/index'];
instance.cacheDuration = '10 seconds';

instance.configure = function (config) {
  apiCacheConfig = config.apiCache;
  apicache = config.apicacheInstance;
}

instance.render = function (req, res) {
  res.send({
    index: apicache.getIndex(),
    cacheDuration: instance.cacheDuration,
    error: !apiCacheConfig.debug,
    message: 'This endpoint only functions correctly when config.apiCache.debug is set to true.'
  });
}

module.exports = instance;
