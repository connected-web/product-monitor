var installHook = require('./installHook');

var instance = {};

instance.log = [];

instance.store = function (message) {
  var timestamp = Date.now();
  instance.log.push({
    time: timestamp,
    line: message
  });
}

instance.capture = function() {
  installHook(process.stdout);
  process.stdout.hook('write', function(string, encoding, fd, write) {
    instance.store(string);
    write(string);
  }, true);
}

module.exports = instance;
