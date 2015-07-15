var instance = function () {}

var apicache = false;

var resultCache = {

};

var commandsInProgress = {

};

instance.routes = ['/api/npmStatus', '/api/npmStatus/:packageName'];
instance.cacheDuration = '30 minutes';

instance.configure = function (config) {
  apicache = config.apicacheInstance;
}

function runCommandOneAtATime(command, callback) {
  if (commandsInProgress[command]) {
    console.log(command, ' is already in progress');
    return;
  }

  console.log('Starting command ', command);
  commandsInProgress[command] = true;

  var exec = require('child_process').exec
  var child = exec(command, function (error, stdout, stderr) {
    callback(error, stdout, stderr);
    commandsInProgress[command] = false;
  });
}

function createCommandFrom(req) {
  var packageNames = [];
  if (req.params.packageName) {
    packageNames.push(req.params.packageName);
  }

  // Generate command based on optional package names
  var command = 'npm outdated {packages} --json=true'.replace('{packages}', packageNames.join(' '));

  return command;
}

instance.render = function (req, res) {

  function futureDealWithCommandResult(error, stdout, stderr) {
    var data = false;
    var message = false;
    if (error) {
      message = 'Exec error: ' + command + ', ' + error + ', ' + stderr;
    } else {
      message = 'Command success: ' + command;
      if (stdout) {
        try {
          data = JSON.parse(stdout);
        } catch (parseException) {
          message = 'Error parsing command as JSON: ' + stdout;
          error = true;
        }
      } else {
        if (packageNames.length > 0) {
          message = 'No updates required. Packages ' + packageNames.join(', ') + ' up to date.';
        } else {
          message = 'No updates required, all packages up to date.';
        }
        data = {};
      }
    }

    console.log(message);

    var result = {
      data: data,
      message: message,
      error: error,
      cacheDuration: instance.cacheDuration,
      command: command
    };

    // Update the local result cache
    resultCache[command] = result || error || false;
  }

  // Create command to run
  var command = createCommandFrom(req);

  // Trigger the command, if not already running
  runCommandOneAtATime(command, futureDealWithCommandResult);

  // Check for stored result to return
  var storedResult = resultCache[command];
  if (storedResult) {
    res.json(storedResult);
  } else {
    var unavailable = {
      data: false,
      message: 'NPM data is currently unavailable, waiting for data to be collected by server.',
      error: true,
      cacheDuration: instance.cacheDuration,
      command: command
    };
    res.json(unavailable);

    // Reset the server level cache
    console.log('Clearing apicache for ', req.url);
    apicache.clear(req.url);
  }
}

module.exports = instance;
