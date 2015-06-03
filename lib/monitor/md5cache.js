var md5 = require('md5-node');

function createMd5Cache(staleAge) {

  var staleAge = staleAge || 30000; // milliseconds

  var instance = {};
  var statusCache = {};

  instance.checkFor = function(key) {
    var md5key = md5(key);
    var result = false;
    var cachedEntry = statusCache[md5key];
    var timestamp = Date.now();

    if(cachedEntry && cachedEntry.timestamp > timestamp - staleAge) {
      result = cachedEntry;
    }

    return result;
  }

  instance.store = function(key, statusResponse) {
    var md5key = md5(key);
    statusResponse.timestamp = Date.now();
    statusCache[md5key] = statusResponse;
  }

  return instance;
}

module.exports = createMd5Cache;
