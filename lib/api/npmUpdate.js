// Models
var commandRunner = require('../monitor/commandRunner');
var serverDetails = require('../monitor/serverDetails');

var updatesDisabled = false;
var apicache = false;
var resultCache = {};
var commandsInProgress = {};
var updating = false;

// View
var handlebars = require('handlebars');
var templateConfirm = handlebars.compile('<post-button post-url="/api/updateServer/auth/{{restart-auth-code}}" result-target="{{result-target}}" id="{{result-target}}"><icon>ok</icon> {{message}}</post-button>');
var templateUpdating = handlebars.compile('<button class="btn btn-info disabled"><icon>cog</icon> {{message}}</button>');

// Controller
var endpoint = {};

var server = false;

endpoint.method = 'post';
endpoint.routes = ['/api/updateServer', '/api/updateServer/:serverHash', '/api/updateServer/auth/:authCode'];
endpoint.cacheDuration = '1 second';
endpoint.description = 'Attempts to update the server packages by running `npm update --save`';

endpoint.configure = function (config) {
  updatesDisabled = config.npmUpdate.disableUpdates;
}

function runCommandOneAtATime(command, callback) {
  if (commandsInProgress[command]) {
    console.log(command, ' is already in progress');
    return;
  }

  console.log('[npm Update API] Starting command ', command);
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

  function dealWithResult(result) {
    var data = false;
    var message = false;
    if (result.error || result.stderr) {
      message = 'Exec error: ' + command + ', ' + result.error + ', ' + result.stderr;
    } else {
      if (result.stdout) {
        data = result.stdout;
        message = 'Update complete!';
        console.log('[npm Update API]', message, command, process.cwd(), result.error, result.stderr, result.stdout);

        // Prompt a restart!
        setTimeout(beginRestart, 0);
      } else {
        if (packageNames.length > 0) {
          message = 'No updates required. Packages ' + packageNames.join(', ') + ' up to date.';
        } else {
          message = 'No updates required, all packages up to date.';
        }
        data = {};
      }
    }

    console.log(message, process.cwd());

    var result = {
      data: data,
      message: message,
      error: result.error,
      cacheDuration: endpoint.cacheDuration
    };

    // Update the local result cache
    resultCache[command] = templateUpdating({
      message: 'Update Complete, Restarting...'
    });
  }

  // Trigger the command, if not already running
  commandRunner.run(command, dealWithResult);
}

function beginRestart() {
  console.log('Going down for a restart in 2 seconds');
  setTimeout(function () {
    console.log('Attempting a restart...');
    updating = false;
    var serverendpoint = serverDetails.endpoint;
    serverendpoint.restart();
  }, 2000);
}

function validate(authCode) {
  return (authCode === serverDetails.serverHash);
}

endpoint.render = function (req, res) {
  var response = '';
  if (updating) {
    response = templateUpdating({
      message: 'Updating'
    });
  } else if(updatesDisabled) {
    response = templateUpdating({
      message: 'Updates disabled by Server Config'
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

module.exports = endpoint;
