// Models
var serverDetails = require('../monitor/serverDetails');
var apicache = false;
var resultCache = {};
var commandsInProgress = {};
var updating = false;

// View
var handlebars = require('handlebars');
var templateConfirm = handlebars.compile('<post-button post-url="/api/updateServer/auth/{{restart-auth-code}}" result-target="{{result-target}}" id="{{result-target}}"><icon>ok</icon> {{message}}</post-button></p>');
var templateUpdating = handlebars.compile('<button class="btn btn-info disabled"><icon>cog</icon> {{message}}</button></p>');

// Controller
var instance = {};

var server = false;

instance.method = 'post';
instance.routes = ['/api/updateServer', '/api/updateServer/:serverHash', '/api/updateServer/auth/:authCode'];
instance.cacheDuration = '1 second';

instance.configure = function (config) {

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

function doUpdate() {
  var command = 'npm update --save';
  updating = true;

  function futureDealWithCommandResult(error, stdout, stderr) {
    var data = false;
    var message = false;
    if (error) {
      message = 'Exec error: ' + command + ', ' + error + ', ' + stderr;
    } else {
      if (stdout) {
        data = stdout;
        message = 'Update complete!';
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
      cacheDuration: instance.cacheDuration
    };

    // Update the local result cache
    resultCache[command] = templateUpdating({
      message: 'Update Complete, Restarting...'
    });

    // Restart!
    restart();
  }

  runCommandOneAtATime(command, futureDealWithCommandResult);
}

function restart() {
  console.log('Going down for a restart in 2 seconds');
  setTimeout(function () {
    console.log('Attempting a restart...');
    updating = false;
    var serverInstance = serverDetails.instance;
    serverInstance.restart();
  }, 2000);
}

function validate(authCode) {
  return (authCode === serverDetails.serverHash);
}

instance.render = function (req, res) {
  var response = '';
  if (updating) {
    response = templateUpdating({
      message: 'Updating'
    });
  } else {
    var validKey = validate(req.params.authCode);

    if (validKey) {
      doUpdate();
      response = templateUpdating({
        message: 'Update started'
      });
    } else {
      var now = Date.now();
      response = templateConfirm({
        "restart-auth-code": serverDetails.serverHash,
        "message": 'Confirm Update',
        "result-target": 'confirmButton_' + now
      });
    }
  }

  res.send(response);
}

module.exports = instance;
