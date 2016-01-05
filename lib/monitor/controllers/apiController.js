var assert = require('assert');
var recursiveReadSync = require('recursive-readdir-sync');
var routesModel = require('../../models/routes');
var fs = require('fs');
var apicache; // require(apicache) in instance.configuration
var NL = '\n';

// Configure common variables
function configure(config) {

  var instance = {};
  var applicationConfig = {};

  var basePath = require('path').dirname(require.main.filename);
  var userApiPath = basePath + '/' + config.userContentPath + '/api';
  var serverApiPath = __dirname + '/../../api';

  apicache = require('apicache').options(config.apiCache);
  config.apicacheInstance = apicache;

  applicationConfig = config;
  server = config.server;

  function readApiList(path) {
    var files = [];
    try {
      files = recursiveReadSync(path, function (file) {
        return file.match(/.*js/);
      });
    } catch (error) {
      console.log('[API Warning] Unable to read file list from [' + path + ']' + NL);
    }

    return files;
  }

  function registerApiFiles(files, description, group) {
    var fileRoutes = files.map(function (file) {
      return registerApi(file, group);
    });
    var routes = [].concat.apply([], fileRoutes);

    console.log('[API Info] ' + description + ':', NL + ' ', routes.join(NL + '  '), NL);
  }

  function registerApi(file, group) {
    try {
      var apiModule = require(file);

      // Validate the API interface by checking for required properties and functions
      validateApiRoute(apiModule, file);
      validateApiConfigure(apiModule, file);
      validateApiRender(apiModule, file);

      // Configure module using application config
      apiModule.configure(applicationConfig);

      // Set default duration on the module
      apiModule.cacheDuration = apiModule.cacheDuration || '1 hour';

      // Set default method verb from the module
      apiModule.method = apiModule.method || 'get';

      // Set default preRender method
      apiModule.preRender = apiModule.preRender || function (req) { /* Empty anonymous function */ };

      // Set default description
      apiModule.description = apiModule.description || '';

      // Register module as express server route
      var routes = apiModule.routes.map(function (route) {
        try {
          registerRoute(route, apiModule);
          routesModel.add(group, 'api', route, apiModule.method, apiModule.description, apiModule.cacheTime);
          return route;
        } catch (e) {
          console.log('[API Warning] Unable to register API route ' + route + ', error: ' + e + NL + e.stack);
        }
      });
    } catch (e) {
      console.log('[API Warning] Unable to register API, ' + file + ' error: ' + e + NL + e.stack);
    }

    return routes;
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
        var renderError = {
          message: 'Caught an exception during API render step',
          error: true,
          exception: JSON.stringify(exception)
        };
        console.log('Render Error', renderError);
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
    registerApiFiles(serverFiles, 'Built-in routes', 'built-in');
    return this;
  }

  // Register User API endpoints
  instance.registerUserAPIs = function () {
    var serverFiles = readApiList(userApiPath);
    registerApiFiles(serverFiles, 'User routes', 'user');
    return this;
  }

  return instance;
}

module.exports = {
  configure
};