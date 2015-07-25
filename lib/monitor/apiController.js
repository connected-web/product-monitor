var assert = require('assert');
var recursiveReadSync = require('recursive-readdir-sync');
var fs = require('fs');
var apicache; // require(apicache) in instance.configuration
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

  apicache = require('apicache').options(config.apiCache);
  config.apicacheInstance = apicache;

  applicationConfig = config;
  server = config.server;

  return this;
}

function readApiList(path) {
  var files = [];
  try {
    files = recursiveReadSync(path, function (file) {
      return file.match(/.*js/);
    });
  } catch (error) {
    console.log("[API Warning] Unable to read file list from [" + path + "]" + NL);
  }

  return files;
}

function registerApiFiles(files) {
  files.map(function (file) {
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

    // Set default duration on the module
    apiModule.cacheDuration = apiModule.cacheDuration || "1 hour";

    // Set default method verb from the module
    apiModule.method = apiModule.method || 'get';

    // Set default preRender method
    apiModule.preRender = apiModule.preRender || function (req) { /* Empty anonymous function */ };

    // Register module as express server route
    var routes = apiModule.routes;
    for (var key in routes) {
      var route = routes[key];
      try {
        registerRoute(route, apiModule);
      } catch (e) {
        console.log('[API Warning] Unable to register API route ' + route + ', error: ' + e + NL);
      }

      console.log('[API Info] Registered API route ' + route + NL);
    }
  } catch (e) {
    console.log("[API Warning] Unable to register API, error: " + e + NL);
  }
}

function registerRoute(route, apiModule) {
  server[apiModule.method.toLowerCase()](route, apicache.middleware(apiModule.cacheDuration), wrapRender(apiModule.render));
}

function wrapRender(render) {
  return (function (req, res) {
    // Make the call
    try {
      render(req, res);
    } catch (exception) {
      res.json({
        message: 'Caught an exception during API render step',
        error: true,
        exception: JSON.stringify(exception)
      });

      throw exception;
    }
  });
}

function validateApiRoute(apiModule, file) {
  var advice = ".route property not defined as a String on API: " + file + ", example: .route = '/api/my-route-name/:param';" + NL;

  if (apiModule.route) {
    assert.ok(typeof apiModule.route === "string", advice);
    apiModule.routes = [apiModule.route];
  } else if (apiModule.routes) {
    assert.ok(Array.isArray(apiModule.routes), advice);
  } else {
    assert.fail(advice);
  }
}

function validateApiConfigure(apiModule, file) {
  var advice = ".configure(config) function not defined on API: " + file + ", example: " + "instance.config = function(config) {" + "  var server = config.server" + "}" + NL;

  assert.ok(typeof apiModule.configure === "function", advice);
}

function validateApiRender(apiModule, file) {
  var advice = ".render(req, res) function not defined on API: " + file + ", example: " + "instance.render = function(req, res) {" + "  var data = {key: 'value'};" + "  res.send(data);" + "}" + NL;

  assert.ok(typeof apiModule.render === "function", advice);
}

// Register Module API endpoints
instance.registerServerAPIs = function () {
  var serverFiles = readApiList(serverApiPath);
  registerApiFiles(serverFiles);
  return this;
}

// Register User API endpoints
instance.registerUserAPIs = function () {
  var serverFiles = readApiList(userApiPath);
  registerApiFiles(serverFiles);
  return this;
}

module.exports = instance;
