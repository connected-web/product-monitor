var request = require('request');

var statusCache = require('../monitor/md5cache')();

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

function statusOf(req, res) {
  var url = req.query.url;

  var cachedResponse = statusCache.checkFor(url);
  if(cachedResponse) {
    res.jsonp(cachedResponse);
  }
  else {
    checkUrlForStatus(url, req, res);
  }
}

module.exports = statusOf;
