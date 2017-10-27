var installHook = require('../installHook')

var instance = {}

instance.log = []

instance.store = function (message) {
  var timestamp = Date.now()
  instance.log.push({
    time: timestamp,
    date: (new Date(timestamp).toUTCString()),
    line: message
  })
}

instance.capture = function () {
  installHook(process.stdout)
  process.stdout.hook('write', function (string, encoding, fd, write) {
    instance.store((string + '').trim())
    write(string)
  }, true)
}

instance.store('[Server Log Created]')

module.exports = instance
