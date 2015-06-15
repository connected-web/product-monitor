var request = require('request');
var statusCache = require('../monitor/md5cache')();

var localServerPort = false;

var instance = function() {}

instance.route = "/api/statusOf";

instance.configure = function(config) {
  var statusCacheTimeInSeconds = config.statusCacheTimeInSeconds || 0;
  localServerPort = config.serverPort;

  statusCache.staleAge(statusCacheTimeInSeconds);
}

function addLocalhost(url) {
  if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
    var port = localServerPort;
    url = "http://localhost:" + port + url;
  }
  return url;
}

function checkUrlForStatus(url, req, res) {
  var requestUrl = addLocalhost(url);
  request(requestUrl, function(error, response, body) {
    var result = {};
    if(!error) {
      result = {
          "statusCode": response.statusCode,
          "urlProvided" : url,
          "requestedUrl": requestUrl
      };
    }
    else {
      if(error.code == "ENOTFOUND" && error.syscall == "getaddrinfo") {
        error = "DNS lookup failed on address";
      }

      result = {
        "error": error,
        "statusCode": 502,
        "urlProvided" : url,
        "requestedUrl": requestUrl
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
