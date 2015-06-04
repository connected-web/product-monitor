var request = require('request');

var statusCache = require('../monitor/md5cache')();

var instance = function() {}

function checkUrlForStatus(url, req, res) {
  request(url, function(error, response, body) {
    var result = {};
    if(!error) {
      result = {
          "statusCode": response.statusCode,
          "urlProvided" : url
      };
    }
    else {
      result = {
          "error": error,
          "urlProvided" : url
      };
    }

    res.jsonp(result);

    statusCache.store(url, result);
  });
}

instance.configure = function(config) {
  var statusCacheTimeInSeconds = config.statusCacheTimeInSeconds || 0;

  statusCache.staleAge(statusCacheTimeInSeconds);
}

instance.check = function(req, res) {
  var url = req.query.url;

  var cachedResponse = statusCache.checkFor(url);
  if(cachedResponse) {
    res.jsonp(cachedResponse);
  }
  else {
    checkUrlForStatus(url, req, res);
  }
}

module.exports = instance;
