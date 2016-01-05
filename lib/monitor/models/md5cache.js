var md5 = require('md5-node');

function createMd5Cache(staleAge) {

  var staleAge = staleAge || 0; // in milliseconds
  var instance = {};
  var statusCache = {};

  instance.staleAge = function(ageInSeconds) {
    staleAge = (ageInSeconds === undefined) ? staleAge : (ageInSeconds * 1000);

    return staleAge;
  }

  instance.checkFor = function(key) {
    var md5key = md5(key);
    var result = false;
    var cachedEntry = statusCache[md5key];
    var timestamp = Date.now();
    var staleAge = instance.staleAge();

    if(cachedEntry && cachedEntry.timestamp > timestamp - staleAge) {
      result = cachedEntry;
    }

    return result;
  }

  instance.store = function(key, statusResponse) {
    var md5key = md5(key);
    statusResponse.timestamp = Date.now();
    statusResponse.cacheAgeLimitInSeconds = Math.round(instance.staleAge() / 1000);
    statusCache[md5key] = statusResponse;
  }

  return instance;
}

module.exports = createMd5Cache;
