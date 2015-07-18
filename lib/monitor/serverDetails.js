var md5 = require('md5-node');

var bootTime = Date.now();
var serverHash = md5(bootTime);

var instance = {
  bootTime: bootTime,
  serverHash: serverHash,
  get: function () {
    var currentTime = Date.now();
    var serverAgeInSeconds = Math.floor((currentTime - instance.bootTime) / 1000);

    var details = {
      bootTime: instance.bootTime,
      currentTime: Date.now(),
      serverAgeInSeconds: serverAgeInSeconds,
      serverHash: instance.serverHash
    };

    return details;
  },
  instance: false
};

module.exports = instance;
