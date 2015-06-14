var assert = require('assert')
var fs = require('fs');
var NL = "\n";

var instance = {};

var userApiPath = false;
var serverApiPath = false;

var applicationConfig = {};
var server = false;

// Configure common variables
instance.configure = function (config) {
  var basePath = require('path').dirname(require.main.filename);
  userApiPath = basePath + "/" + config.userContentPath + "/api";
  serverApiPath = __dirname + "/../api";

  applicationConfig = config;
  server = config.server;

  return this;
}

function readApiList(path) {
  var files = [];
  try {
    files = fs.readdirSync(path).filter(function(file) {
      return file.match(/.*js/);
    })
  }
  catch(error) {
    console.log("[API Warning] Unable to read file list from [" + path + "]" + NL);
  }

  files = files.map(function(file) {
    return path + "/" + file;
  });

  return files;
}

function registerApiFiles(files) {
  files.map(function(file) {
    registerApi(file);
  });
}

function registerApi(file) {
  try {
    var apiModule = require(file);

    // Validate the API interface by checking for required properties and functions
    validateApiRoute(apiModule, file);
    validateApiConfigure(apiModule, file);
    validateApiRender(apiModule, file);

    // Configure module using application config
    apiModule.configure(applicationConfig);

    // Register module as express server route
    server.get(apiModule.route, apiModule.render);
  }
  catch(e) {
    console.log("[API Warning] Unable to register API, error: " + e + NL);
  }
}

function validateApiRoute(apiModule, file) {
  var advice = ".route property not defined as a String on API: " + file + ", example: .route = '/api/my-route-name/:param';" + NL;

  assert.ok(typeof apiModule.route === "string", advice);
}

function validateApiConfigure(apiModule, file) {
  var advice = ".configure(config) function not defined on API: " + file + ", example: "
  + "instance.config = function(config) {"
  + "  var server = config.server"
  + "}" + NL;

  assert.ok(typeof apiModule.configure === "function", advice);
}

function validateApiRender(apiModule, file) {
  var advice = ".render(req, res) function not defined on API: " + file + ", example: "
  + "instance.render = function(req, res) {"
  + "  var data = {key: 'value'};"
  + "  res.send(data);"
  + "}" + NL;

  assert.ok(typeof apiModule.render === "function", advice);
}

// Register Module API endpoints
instance.registerServerAPIs = function() {
  var serverFiles = readApiList(serverApiPath);
  registerApiFiles(serverFiles);
  return this;
}

// Register User API endpoints
instance.registerUserAPIs = function() {
  var serverFiles = readApiList(userApiPath);
  registerApiFiles(serverFiles);
  return this;
}

module.exports = instance;