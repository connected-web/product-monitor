var request = require('request');

var localServerPort = false;

var instance = function() {}

instance.route = "/api/statusOf";
instance.cacheDuration = "1 minute";

instance.configure = function(config) {
  localServerPort = config.serverPort;
}

function addLocalhost(url) {
  if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
    var port = localServerPort;
    url = "http://localhost:" + port + url;
  }
  return url;
}

function checkUrlForStatus(url, req, res, contentToCheckFor) {
  var requestUrl = addLocalhost(url);
  request({uri: requestUrl, timeout: 250}, function(error, response, body) {
    var result = {};
    if(!error) {
      result = {
          "statusCode": response.statusCode,
          "urlProvided" : url,
          "requestedUrl": requestUrl,
          "contentToCheckFor": contentToCheckFor
      };

      if(body && contentToCheckFor) {
        checkForContentOn(result, contentToCheckFor, body);
      }
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
  });
}

function checkForContentOn(result, contentToCheckFor, body) {
  try {
    if(body.toString().indexOf(contentToCheckFor) > -1) {
      result.message = "Content '" + contentToCheckFor + "' found in reponse.";
    }
    else {
      result.error = "Content '" + contentToCheckFor + "' not found in reponse.";
    }
  }
  catch(exception) {
    result.error = JSON.stringify(exception);
  }
}

instance.render = function(req, res) {
  var url = req.query.url;
  var contains = req.query.contains;

  if(url) {
    checkUrlForStatus(url, req, res, contains);
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
