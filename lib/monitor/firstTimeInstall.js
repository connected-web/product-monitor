var fs = require('fs');
var npc = require('ncp');
var NL = "\n";

var instance = {};

var serverConfig = false;
var userContentPath = false;

instance.configure = function(config) {
  serverConfig = config;
  userContentPath = config.userContentPath;
}

function checkForContentDirectory() {
  var folder = "/content";
  ensureExists(userContentPath + folder, 0744, function(error) {
    if (error) {
      // handle folder creation error
      console.log("[First Run Warning] Content directory does not exist: " + userContentPath + folder + NL);
    }
    else {
      console.log("[First Run Success] Content directory seems to exist: " + userContentPath + folder + NL);
    }
  });
}

function checkForApiDirectory() {
  var folder = "/api";
  ensureExists(userContentPath + folder, 0744, function(error) {
    if (error) {
      // handle folder creation error
      console.log("[First Run Warning] API directory does not exist: " + userContentPath + folder);
    }
    else {
      console.log("[First Run Success] API directory seems to exist: " + userContentPath + folder);
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
  }
  catch(error) {
    if (error) {
      if (error.code == 'EEXIST') cb(null); // ignore the error if the folder already exists
      else cb(error); // something else went wrong
    } else cb(null); // successfully created folder
  };
}

instance.runChecks = function() {

  checkForContentDirectory();
  checkForApiDirectory();
}

module.exports = instance;
