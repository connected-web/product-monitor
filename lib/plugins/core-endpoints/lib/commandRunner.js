const { exec } = require('child_process')

const instance = {}

const commandsInProgress = {}
const commandCache = {}

function runCommand (command, callback) {
  callback = callback || function () {}

  if (commandsInProgress[command]) {
    console.log(command, ' is already in progress')
    return
  }

  startCommand(command, callback)
}

function startCommand (command, callback) {
  console.log('Starting command ', command)
  commandsInProgress[command] = true

  exec(command, function (error, stdout, stderr) {
    var result = {
      error: error,
      stdout: stdout,
      stderr: stderr
    }
    commandCache[command] = result
    commandsInProgress[command] = false
    callback(result)
  })
}

instance.runCached = function (command, callback) {
  var cachedResult = commandCache[command]
  if (cachedResult) {
    setTimeout(function () {
      callback(cachedResult)
    }, 0)
  } else {
    runCommand(command, callback)
  }
}

instance.run = function (command, callback) {
  runCommand(command, callback)
}

module.exports = instance
