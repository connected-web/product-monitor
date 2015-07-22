var glob = require('glob');
var path = require('path');
var pathParse = require('path-parse');

/*
To use this module, create an server.js file containing:
```js
var monitor = require('product-monitor');
var server = monitor();
```
Then run ```node server.js```
*/

// Some requirements
var serverLog = require('./monitor/serverLog');
var serverDetails = require('./monitor/serverDetails');
var url = require('url');
var express = require('express');
var NL = "\n";

// Define all the routes supported by the server, including dynamic ones
function configureRoutes(instance, done) {
  // Unpack variables from instance
  var server = instance.server;
  var config = instance.config;

  // Permit CORS access to this server
  var corsSupport = require('./monitor/corsSupport');
  server.use(corsSupport);

  // Register express body parser to handle form posts
  var bodyParser = require('body-parser');

  // parse application/x-www-form-urlencoded
  server.use(bodyParser.urlencoded({
    extended: false
  }))

  // parse application/json
  server.use(bodyParser.json())

  // Create main controller
  var pageController = require('./monitor/pageController');
  pageController.configure(config);

  // Create API controller
  var apiController = require('./monitor/apiController');
  apiController.configure(config);

  // Register Server API routes
  apiController.registerServerAPIs();

  // Register User API routes
  apiController.registerUserAPIs();

  // Create user index route
  server.get('/', pageController.renderUserContent);

  // Create user content route
  server.get('/content/:contentPath', pageController.renderUserContent);

  // Create documentation routes
  var basePath = path.dirname(require.main.filename);
  var documentationPath = basePath + '/' + config.modulePath + '/documentation';
  var documentationPattern = documentationPath + '/**/*.fragment.html';
  glob(documentationPattern, {}, function (error, files) {
    if (error) {
      console.error('Unable to find documentation fragments', error);
      return;
    }

    files.map(function (file) {
      var pathInfo = pathParse(file);
      // Remove the .fragment part:
      var route = '/docs/' + pathParse(pathInfo.name).name;
      console.log('Creating content path for', route);
      server.get(route, pageController.createRenderFunctionFor(file));
    });
  });
  // Map status endpoint to its new home
  server.use('/status', function(req, res) {
    res.redirect('/docs/status');
  });

  // Serve static files locally
  server.use('/favicon.ico', express.static(config.modulePath + "/images/favicon.ico"));
  server.use('/images', express.static(config.modulePath + "/images"));

  // Module instance API
  instance.server = server;
  instance.restart = function () {
    restartServer(instance);
  };

  instance.listen = function (onListening) {
    return heyListen(instance, onListening);
  };

  // Register a static reference in serverDetails
  serverDetails.instance = instance;

  // Wait a moment and then complete
  setTimeout(done, 0);
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

  instance.httpServer = server.listen(config.serverPort, config.ipAddress, function () {
      console.log(
        config.productInformation.title + ' Server started on ' +
        url.format({
          protocol: 'http',
          hostname: 'localhost',
          query: '',
          pathname: '',
          port: config.serverPort
        }) + NL);

      if (onListening && typeof onListening == "function") {
        onListening(null);
      }
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

  // Create server
  var server = express();

  // Load default for conig
  var config = require('./monitor/defaultConfig').merge(config);
  config.server = server;

  // Collapse variables onto instance
  instance.server = server;
  instance.config = config;

  // Run first-time install checks, and then start server:
  var firstTimeInstall = require('./monitor/firstTimeInstall');
  firstTimeInstall.configure(config);
  firstTimeInstall.runChecks(function () {
    configureRoutes(instance, onConfigured);
  });

  function onConfigured() {
    // Check for an onReady callback
    if (onReady && typeof onReady == 'function') {
      // Let the user call listen when ready
      console.log(config.productInformation.title, "ready to run! Call instance.listen() on your callback.")
      onReady(instance);
    } else {
      // Call listen ourselves
      instance.listen();
    }
  }

  return instance;
}

module.exports = function (config, onReady) {
  // Capture logs
  serverLog.capture();

  // Do the starting
  var instance = startServer(config, onReady);

  // Wait here
  return instance;
}
