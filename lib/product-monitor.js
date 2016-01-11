var find = require('promise-path').find;
var path = require('path');
var pathParse = require('path-parse');
var request = require('request');
var url = require('url');
var express = require('express');

var authSetup = require('./monitor/authentication/setup');
var serverLog = require('./monitor/models/serverLog');
var serverDetails = require('./monitor/models/serverDetails');
var routesModel = require('./monitor/models/routes');
var NL = '\n';

// Define all the routes supported by the server, including dynamic ones
function configureRoutes(instance) {
  // Unpack variables from instance
  var server = instance.server;
  var config = instance.config;

  // Permit CORS access to this server
  var corsSupport = require('./monitor/corsSupport');
  server.use(corsSupport);

  // Map status endpoint to its new home
  server.use('/status', function (req, res) {
    res.redirect('/docs/status');
  });

  // Serve static files locally
  server.use('/favicon.ico', express.static(config.userContentPath + '/images/favicon.ico'));
  server.use('/images', express.static(config.userContentPath + '/images'));
  server.use('/external', express.static(config.modulePath + '/external'));
  server.use('/fonts', express.static(config.modulePath + '/fonts'));

  return Promise.accept();
}

function createContentRoutes(server, pageController) {
  // Create user index route
  server.get('/', pageController.renderUserContent);

  // Create user content route
  server.get('/content/:contentPath', pageController.renderUserContent);

  // Create user content route for API purposes
  server.get('/api/content/read/:contentPath', pageController.readUserContent);
  server.post('/api/content/save/:contentPath', pageController.saveUserContent);

  return Promise.accept();
}

// Well, good luck...
function restartServer(instance) {
  process.exit(0);
}

// Kick express into action
function heyListen(instance, onListening) {
  // Unpack variables from instance
  var server = instance.server;
  var config = instance.config;

  function reportListening() {
    const title = config.productInformation.title;
    global.listeningTime = (Date.now() - global.startTime) / 1000;
    console.log(`[${title} Listening] on`, global.hostUrl, '-- Start up time:', global.listeningTime.toFixed(2), 'ms', NL);
  }

  instance.httpServer = server.listen(config.serverPort, config.ipAddress, function () {
      global.hostUrl = url.format({
        protocol: 'http',
        hostname: 'localhost',
        query: '',
        pathname: '',
        port: config.serverPort
      });

      if (onListening && typeof onListening == "function") {
        onListening(null);
      }
      // Prod the navigation endpoint
      request(global.hostUrl + '/api/navigation', reportListening);
    })
    .on('error', function (e) {
      console.log('Could not start server: ');
      if (e.code == 'EADDRINUSE') {
        console.log(' Port address already in use.');
      }
      console.log('  ' + e);

      if (onListening && typeof onListening == "function") {
        onListening(false);
      }
    });

  return instance.httpServer;
}

// Things to do to start the server
function startServer(config, onReady) {

  // Form a response
  var instance = {};
  var models = {};

  // Register models
  models.serverLog = serverLog;
  models.serverDetails = serverDetails;
  models.routes = routesModel;

  // Capture console
  serverLog.capture();

  // Create server
  var server = express();

  // Load default for conig
  var config = require('./monitor/defaultConfig').merge(config);
  config.server = server;
  config.models = models;

  // Register a static reference in serverDetails
  serverDetails.instance = instance;

  // Report server name
  const title = config.productInformation.title;
  console.log(NL + `[Starting ${title}]`, NL);
  global.startTime = Date.now();

  // Collapse variables onto instance
  instance.server = server;
  instance.config = config;
  instance.restart = function () {
    restartServer(instance);
  };
  instance.listen = function (onListening) {
    return heyListen(instance, onListening);
  };

  // Register Page controller
  var pageController = require('./monitor/controllers/pageController').configure(config);

  // Create API controller
  var apiController = require('./monitor/controllers/apiController').configure(config);

  // Create Plugin controller
  var pluginController = require('./monitor/controllers/pluginController').configure(config);

  instance.addContentPage = function (file) {
    var pathInfo = pathParse(file);
    // Remove the .fragment part:
    var route = '/docs/' + pathParse(pathInfo.name).name;
    server.get(route, pageController.createRenderFunctionFor(file));
    return route;
  };

  instance.registerPluginAPIs = apiController.registerPluginAPIs;

  // Run first-time install checks, and then start server:
  var firstTimeInstall = require('./monitor/firstTimeInstall');
  firstTimeInstall.configure(config);
  firstTimeInstall.runChecks(function () {
    // Register local content routes
    authSetup(instance)
      .then(() => configureRoutes(instance))
      .then(() => createContentRoutes(server, pageController))
      .then(apiController.registerUserAPIs)
      .then(() => pluginController.loadBuiltInPlugins(instance))
      .then(() => pluginController.loadUserPlugins(instance))
      .then(onConfigured)
      .catch((ex) => console.log(ex, ex.stack));
  });

  function onConfigured() {
    // Check for an onReady callback
    if (onReady && typeof onReady == 'function') {
      // Let the user call listen when ready
      console.log(`[${title}]`, 'ready to run! Call instance.listen() on your callback.')
      onReady(instance);
    } else {
      // Call listen ourselves
      instance.listen();
    }
  }

  return instance;
}

module.exports = function (config, onReady) {
  // Do the starting
  var instance = startServer(config, onReady);

  // Wait here
  return instance;
}