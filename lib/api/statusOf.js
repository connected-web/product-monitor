var request = require('request');

var localServerPort = false;

var instance = function () {}

var resultsCache = {};

instance.route = '/api/statusOf';
instance.cacheDuration = '59 seconds';

instance.configure = function (config) {
  localServerPort = config.serverPort;
}

function addLocalhost(url) {
  if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
    var port = localServerPort;
    url = "http://localhost:" + port + url;
  }
  return url;
}

var errorCodes = {
  ENOTFOUND: "DNS lookup failed on address",
  ETIMEDOUT: "Request timed out",
  ECONNREFUSED: "Connection refused",
  ECONNRESET: "Connection reset",
  ESOCKETTIMEDOUT: "Socket timed out"
};

function checkUrlForStatus(url, method, req, res, contentToCheckFor, contentTypeToCheckFor) {
  method = (method + '').toUpperCase();
  var requestUrl = addLocalhost(url);
  var error = false;
  var message = false;

  request({
    uri: requestUrl,
    method: method,
    timeout: 900
  }, function (error, response, body) {
    var result = {};
    if (!error) {
      if (response.statusCode === 200) {
        error = false;
        message = "Seems ok";
      } else {
        error = (response.body + '').replace(/:/g, ': ');
        message = 'Non 200 status code received';
      }

      result = {
        "error": error,
        "message": message,
        "statusCode": response.statusCode,
        "urlProvided": url,
        "requestedUrl": requestUrl,
        "contentToCheckFor": contentToCheckFor,
        "headers": response.headers,
        "body": (body && body.length > 100) ? 'Body length is greater than 100 characters' : body
      };

      // Additional check for content type
      if(!result.error && contentTypeToCheckFor) {
        checkForContentTypeOn(result, contentTypeToCheckFor, response);
      }

      // Additional check for content body
      if (!result.error && body && contentToCheckFor) {
        checkForContentOn(result, contentToCheckFor, body);
      }
    } else {
      message = errorCodes[error.code] || error.code || false;
      result = {
        "error": error,
        "message": message,
        "statusCode": 510,
        "urlProvided": url,
        "requestedUrl": requestUrl,
        "headers": false,
        "body": body
      };
    }

    result.time = Date.now();
    result.date = (new Date()).toUTCString();
    var results = addToCache(req.url, result);

    res.jsonp(results);
  });
}

function addToCache(url, result) {
  var entry = resultsCache[url] || {
    cacheKey: url,
    records: [],
    latest: {}
  };

  if(entry.records.length > 10) {
    entry.records.shift();
  }
  entry.records.push(result);
  entry.latest = result;

  updateAges(entry.records, Date.now());

  resultsCache[url] = entry;

  return entry;
}

function updateAges(records, now) {
  records.forEach(function(item) {
    item.ageInSeconds = Math.round((now - item.time) / 1000);
  });
}

function checkForContentOn(result, contentToCheckFor, body) {
  try {
    if (body.toString().indexOf(contentToCheckFor) !== -1) {
      result.message = "Content '" + contentToCheckFor + "' found in reponse";
    } else {
      result.error = true;
      result.message = "Content '" + contentToCheckFor + "' not found in reponse";
    }
  } catch (exception) {
    result.error = exception;
    result.message = JSON.stringify(exception);
  }
}

function checkForContentTypeOn(result, expectedContentType, response) {
  var actualContentType = response.headers['content-type'];
  if(actualContentType.indexOf(expectedContentType) === -1) {
    result.error = true;
    result.message = 'Content-type: ' + actualContentType + ' does not contain ' + expectedContentType;
  }
}

instance.render = function (req, res) {
  var url = req.query.url;
  var contains = req.query.contains;
  var contentType = req.query['content-type'] || false;
  var method = req.query.method || 'get';

  if (url) {
    checkUrlForStatus(url, method, req, res, contains, contentType);
  } else {
    res.status(400).send({
      "error": "No url provided in query string. (?url=)",
      "statusCode": 400,
      "urlProvided": url
    });
  }
}

module.exports = instance;
