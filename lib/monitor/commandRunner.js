var instance = {};

var commandsInProgress = {};
var commandCache = {};

function runCommandOneAtATime(command, callback) {
  callback = callback || function () {};

  if (commandsInProgress[command]) {
    console.log(command, ' is already in progress');
    return;
  }

  startCommand(command, callback);
}

function startCommand(command, callback) {
  console.log('Starting command ', command);
  commandsInProgress[command] = true;

  var exec = require('child_process').exec;
  var child = exec(command, function (error, stdout, stderr) {
    var result = {
      error: error,
      stdout: stdout,
      stderr: stderr
    };
    commandCache[command] = result;
    commandsInProgress[command] = false;
    callback(result);
  });
}

instance.run = function (command, callback) {
  runCommandOneAtATime(command, callback);
}

module.exports = instance;
