var fs = require('fs');
var ncp = require('ncp').ncp;
var NL = "\n";

var instance = {};

var serverConfig = false;
var userContentPath = false;
var moduleContentPath = false;

instance.configure = function (config) {
  serverConfig = config;
  userContentPath = config.userContentPath;
  moduleContentPath = config.modulePath;
}

function checkForUserDirectory() {
  ensureExists(userContentPath, 0744, function (error) {
    if (error) {
      console.log("[Startup Check] Created user content directory: " + userContentPath + NL);
      stepFinished('checkForUserDirectory');
    } else {
      // console.log("[Startup Check] User content directory seems to exist: " + userContentPath + NL);
      skipStep('checkForUserDirectory');
    }
  });
}

function checkForContentDirectory() {
  var folder = "/content";
  ensureExists(userContentPath + folder, 0744, function (error) {
    if (error) {
      // handle folder creation error
      console.log("[Startup Info] Creating user content directory at " + userContentPath + folder + NL);
      copyTo(moduleContentPath + folder, userContentPath + folder, folder, 'checkForContentDirectory');
    } else {
      // console.log("[Startup Check] Content directory seems to exist: " + userContentPath + folder + NL);
      skipStep('checkForContentDirectory');
    }
  });
}

function checkForApiDirectory() {
  var folder = "/api";
  ensureExists(userContentPath + folder, 0744, function (error) {
    if (error) {
      // handle folder creation error
      console.log("[Startup Info] Creating user API directory at: " + userContentPath + folder + NL);
      copyTo(moduleContentPath + folder, userContentPath + folder, folder, 'checkForApiDirectory');
    } else {
      // console.log("[Startup Check] API directory seems to exist: " + userContentPath + folder + NL);
      skipStep('checkForApiDirectory');
    }

  });
}

function checkForImagesDirectory() {
  var folder = '/images';
  ensureExists(userContentPath + folder, 0744, function (error) {
    if (error) {
      // handle folder creation error
      console.log("[Startup Info] Creating user images directory at: " + userContentPath + folder + NL);
      copyTo(moduleContentPath + folder, userContentPath + folder, folder, 'checkForImagesDirectory');
    } else {
      // console.log("[Startup Check] Images directory seems to exist: " + userContentPath + folder + NL);
      skipStep('checkForImagesDirectory');
    }
  });
}

function ensureExists(path, mask, cb) {
  if (typeof mask == 'function') { // allow the `mask` parameter to be optional
    cb = mask;
    mask = 0777;
  }
  try {
    fs.mkdirSync(path, mask);
    cb(true);
  } catch (error) {
    if (error) {
      if (error.code == 'EEXIST') {
        cb(false); // ignore the error if the folder already exists
      } else {
        cb(error); // something else went wrong
      }
    }
  };
}

function copyTo(source, destination, path, step) {
  console.log("Copying path " + path + NL);

  ncp(source, destination, function (err) {
    if (err) {
      return console.error(err);
    } else {
      console.log('Copied ' + path + ' done!' + NL);
      stepFinished(step);
    }
  });
}

var onReadyCallback = false;
var completedSteps = {
  checkForUserDirectory: false,
  checkForContentDirectory: false,
  checkForApiDirectory: false,
  checkForImagesDirectory: false
}
var checkedUserDirectory = false;
var checkedContentDirectory = false;
var checkedApiDirectory = false;
var checkedImagesDirectory = false;

function stepFinished(step) {
  console.log("[Startup Step Finished] " + step + NL);
  completedSteps[step] = true;
  checkForCompletion();
}

function skipStep(step) {
  completedSteps[step] = true;
  checkForCompletion();
}

function checkForCompletion() {
  for (key in completedSteps) {
    if (completedSteps[key] == false) {
      return;
    }
  }

  console.log("[Startup Checks Complete] " + NL);
  onReadyCallback.call();
}

instance.runChecks = function (callback) {

  onReadyCallback = callback;
  if (typeof onReadyCallback !== "function") {
    throw "Cannot run checks without a callback, this method needs to be synchronous, but makes asynchronous calls to the file system.";
  }

  checkForUserDirectory();
  checkForContentDirectory();
  checkForApiDirectory();
  checkForImagesDirectory();
}

module.exports = instance;
