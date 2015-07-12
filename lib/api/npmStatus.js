var npm = require("npm");

var instance = function() {}

instance.routes = ["/api/npmStatus", "/api/npmStatus/:packageName"];
instance.cacheDuration = "5 minutes";

instance.configure = function(config) {

}

function handleBuffer(req, res, buffer, command) {
  var jsonData;
  try {
    jsonData = JSON.parse(buffer);
    data = {
      output: jsonData,
      message: 'Command completed OK',
      command: command,
      cacheDuration: instance.cacheDuration
    };
  } catch (exception) {
    data = {
      error: exception,
      raw: buffer,
      message: 'Failed to run command.',
      command: command
    };
  }
  res.send(data);
}

function runCommandAndReturn(req, res, command) {
  var exec = require('child_process').exec
  var child = exec(command, function(error, stdout, stderr) {
    if (error !== null) {
      console.log('Exec error: ' + command + ', ' + error);
      data = {
        error: error,
        stdout: stdout,
        stderr: stderr,
        message: 'Problem parsing response from NPM Outdated.'
      };
      res.send(error);
    } else {
      console.log('Command executed ' + command);
      handleBuffer(req, res, stdout, command);
    }
  });
}

instance.render = function(req, res) {
  var packageNames = [];
  if(req.params.packageName) {
    packageNames.push(req.params.packageName);
  }

  runCommandAndReturn(req, res, ("npm outdated {packages} --json=true").replace('{packages}', packageNames.join(' ')));
}

module.exports = instance;
