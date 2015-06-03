var request = require('request');
var md5 = require('md5-node');

var staleAge = 30000; // milliseconds
var statusCache = {};

function checkCacheFor(key) {
  var md5key = md5(key);
  var result = false;
  var cachedEntry = statusCache[md5key];
  var timestamp = Date.now();

  if(cachedEntry && cachedEntry.timestamp > timestamp - staleAge) {
    result = cachedEntry;
  }

  return result;
}

function storeInCache(key, statusResponse) {
  var md5key = md5(key);
  statusResponse.timestamp = Date.now();
  statusCache[md5key] = statusResponse;
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
      result = {
          "error": error,
          "urlProvided" : url
      };
    }

    res.jsonp(result);

    storeInCache(url, result);
  });
}

module.exports = function (req, res) {

  var url = req.query.url;

  var cachedResponse = checkCacheFor(url);
  if(cachedResponse) {
    res.jsonp(cachedResponse);
  }
  else {
    checkUrlForStatus(url, req, res);
  }
}
