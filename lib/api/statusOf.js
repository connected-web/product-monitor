var request = require('request');

var statusCache = require('../monitor/md5cache')();

var instance = function() {}

instance.configure = function(config) {
  var statusCacheTimeInSeconds = config.statusCacheTimeInSeconds || 0;

  statusCache.staleAge(statusCacheTimeInSeconds);
}

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
      if(error.code == "ENOTFOUND" && error.syscall == "getaddrinfo") {
        error = "DNS lookup failed on address";
      }

      result = {
        "error": error,
        "statusCode": 502,
        "urlProvided" : url
      };
    }

    res.jsonp(result);

    statusCache.store(url, result);
  });
}

instance.render = function(req, res) {
  var url = req.query.url;

  var cachedResponse = statusCache.checkFor(url);
  if(cachedResponse) {
    res.jsonp(cachedResponse);
  }
  else if(url) {
    checkUrlForStatus(url, req, res);
  }
  else {
    res.status(500).send({
      "error": "No url provided in query string. (?url=)",
      "statusCode": 500,
      "urlProvided" : url
    });
  }
}

module.exports = instance;
