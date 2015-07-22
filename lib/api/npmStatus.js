var commandRunner = require('../monitor/commandRunner');
var apicache = false;

var responseCache = {};
var versions = {
  npm: {
    current: 'unknown',
    minimumRequirement: '2.13.1'
  },
  node: {
    current: 'unknown',
    minimumRequirement: 'v0.10.29'
  }
};

var instance = {};

instance.routes = ['/api/npmStatus', '/api/npmStatus/:packageName'];
instance.cacheDuration = '30 minutes';

instance.configure = function (config) {
  apicache = config.apicacheInstance;

  // Pre-cache information at start-up
  commandRunner.runCached('npm --version', npmVersion);
  commandRunner.runCached('node --version', nodeVersion);
  checkPackages();
}

function npmVersion(result) {
  versions.npm.current = (result.stdout || 'unknown').trim();
}

function nodeVersion(result) {
  versions.node.current = (result.stdout || 'unknown').trim();
}

function enhanceSourceData(source) {
  /* Sample source:
  var source = {
    "memory-cache": {
        "current": "0.0.4",
        "wanted": "0.0.5",
        "latest": "0.1.4",
        "location": "node_modules\\product-monitor\\node_modules\\apicache\\node_modules\\memory-cache"
    }
  }
  */
  // Computer, enhance!
  var updatesRequired = false;
  for (var key in source) {
    var module = source[key];
    module.level = (module.location.match(/node_modules/g) || []).length;
    if (module.level === 1 && module.current !== module.wanted) {
      module.updateRequired = true;
      updatesRequired = true;
    } else {
      module.updateRequired = false;
    }
  }

  return updatesRequired;
}

function createCommandFrom(packageNames) {
  // Generate command based on optional package names
  var command = 'npm outdated {packages} --json=true'.replace('{packages}', packageNames.join(' '));

  return command;
}

function interpretOutput(command, output) {
  var data = false;
  var message = false;
  var error = false;
  var updatesRequired = false;

  if (output) {
    // Attempt to parse the result
    try {
      data = JSON.parse(output || '{}');
      updatesRequired = enhanceSourceData(data);
    } catch (parseException) {
      error = true;
    }

    // Summarise
    if (updatesRequired) {
      message = 'Updates available!';
    } else if (error) {
      message = 'Error parsing command as JSON: ' + output + ', for: ' + command;
    } else {
      message = 'No updates required; but some dependent libraries at lower levels in the tree have less-than-current depdendencies.'
    }
  } else {
    // Assume that no updates are required
    message = 'No updates required, all packages up to date.';
    data = {};
  }

  var result = {
    data: data,
    message: message,
    error: error,
    cacheDuration: instance.cacheDuration,
    command: command,
    updatesRequired: updatesRequired,
    versions: versions
  };

  return result;
}

function checkPackages(packageNames) {
  packageNames = packageNames || [];

  // Create command string to run
  var command = createCommandFrom(packageNames);

  // Handle the eventual result of the executed command
  function dealWithResult(result) {
    var response = {};
    if (result.error || result.stderr) {
      response = {
        data: false,
        message: 'Exec error: ' + command + ', ' + result.error + ', ' + result.stderr,
        error: result.error,
        cacheDuration: instance.cacheDuration,
        command: command,
        updatesRequired: false,
        versions: versions
      };
    } else {
      response = interpretOutput(command, result.stdout);
    }

    console.log(response.message);

    // Update the local result cache
    responseCache[command] = response || error || false;
  }

  // Trigger the command, if not already running
  commandRunner.run(command, dealWithResult);

  return command;
}

instance.render = function (req, res) {
  var packageNames = [];
  if (req.params.packageName) {
    packageNames.push(req.params.packageName);
  }

  // Go off and check those packages...
  var command = checkPackages(packageNames);

  // Check for stored result to return
  var storedResult = responseCache[command];
  if (storedResult) {
    res.json(storedResult);
  } else {
    var unavailable = {
      data: false,
      message: 'Package information is currently unavailable; waiting for data to be collected by server.',
      error: true,
      cacheDuration: instance.cacheDuration,
      command: command,
      updatesAvailable: false,
      versions: versions
    };
    res.json(unavailable);

    // Reset the server level cache
    console.log('Clearing apicache for ', req.url);
    apicache.clear(req.url);
  }
}

module.exports = instance;
