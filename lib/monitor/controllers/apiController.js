var assert = require('assert');
var find = require('promise-path').find;
var routesModel = require('../../monitor/models/routes');
var fs = require('fs');
var apicache; // require(apicache) in instance.configuration
var NL = '\n';

// Configure common variables
function configure(config) {

  var instance = {};
  var applicationConfig = {};

  var basePath = require('path').dirname(require.main.filename);
  var userApiPath = basePath + '/' + config.userContentPath + '/api';

  apicache = require('apicache').options(config.apiCache);
  config.apicacheInstance = apicache;

  applicationConfig = config;
  server = config.server;

  function readApiList(path) {
    return find(path + '/**/*.js')
      .catch((error) => console.log('[API Warning] Unable to read file list from [' + path + ']' + NL));
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

      // Check if auth is required for this endpoint
      apiModule.authRequired = apiModule.authRequired || apiModule.authMiddleware || false;

      // Set appropriate auth middleware
      apiModule.authMiddleware = apiModule.authMiddleware || false;
      apiModule.authMiddleware = (apiModule.authMiddleware === false && apiModule.authRequired) ? basicAuth : noAuth;

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

  function noAuth(req, res, next) {
    next();
  }

  function basicAuth(req, res, next) {
    if (req.isAuthenticated() && req.user) {
      next();
    } else {
      res.status(401);
      res.json({
        message: "This endpoint requires authentication",
        error: true
      });
    }
  }

  function registerRoute(route, apiModule) {
    server[apiModule.method.toLowerCase()](route, tryAuth(apiModule.authMiddleware), apicache.middleware(apiModule.cacheDuration), tryRender(apiModule.render));
  }

  function tryAuth(authMiddleware) {
    return function (req, res, next) {
      try {
        authMiddleware(req, res, next);
      } catch (exception) {
        var authError = {
          message: 'Caught an exception during API auth step',
          error: true,
          exception: JSON.stringify(exception),
          stack: JSON.stringify(exception.stack)
        };
        console.log('[API Controller] Auth Error', renderError);
        throw authError;
      }
    }
  }

  function tryRender(render) {
    return (function (req, res) {
      // Make the call
      try {
        render(req, res);
      } catch (exception) {
        var renderError = {
          message: 'Caught an exception during API render step',
          error: true,
          exception: JSON.stringify(exception),
          stack: JSON.stringify(exception.stack)
        };
        console.log('[API Controller] Render Error', renderError);
        throw renderError;
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

  // Register Plugin API endpoints
  instance.registerPluginAPIs = function (path) {
    return readApiList(path)
      .then((apiFiles) => registerApiFiles(apiFiles, 'Plugin routes', 'plugin'));
  }

  // Register User API endpoints
  instance.registerUserAPIs = function () {
    return readApiList(userApiPath)
      .then((apiFiles) => registerApiFiles(apiFiles, 'User routes', 'user'));
  }

  return instance;
}

module.exports = {
  configure
};