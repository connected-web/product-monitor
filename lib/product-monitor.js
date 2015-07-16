/*
To use this module, create an server.js file containing:
```js
var monitor = require('product-monitor');
var server = monitor();
```
Then run ```node server.js```
*/

var serverLog = require('./monitor/serverLog');
var url = require('url');
var express = require('express');
var NL = "\n";

var onReady = false;

function startServer(server, instance, config) {
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
  server.get('/docs/api', pageController.createRenderFunctionFor('documentation/api.fragment.html'));
  server.get('/docs/component-showcase', pageController.createRenderFunctionFor('documentation/component-showcase.fragment.html'));
  server.get('/docs/create-your-own', pageController.createRenderFunctionFor('documentation/create-your-own.fragment.html'));
  server.get('/docs/custom-components-guide', pageController.createRenderFunctionFor('documentation/custom-components-guide.fragment.html'));
  server.get('/docs/custom-api-endpoint-guide', pageController.createRenderFunctionFor('documentation/custom-api-endpoint-guide.fragment.html'));
  server.get('/docs/package-info', pageController.createRenderFunctionFor('documentation/package-info.fragment.html'));
  server.get('/docs/credits', pageController.createRenderFunctionFor('documentation/credits.fragment.html'));
  server.get('/docs/management', pageController.createRenderFunctionFor('documentation/management.fragment.html'));
  server.get('/docs/updates', pageController.createRenderFunctionFor('documentation/updates.fragment.html'));
  server.get('/status', pageController.createRenderFunctionFor('documentation/status.fragment.html'));

  // Serve static files locally
  server.use('/favicon.ico', express.static(config.modulePath + "/images/favicon.ico"));
  server.use('/images', express.static(config.modulePath + "/images"));

  // Module instance API
  instance.server = server;
  instance.listen = heyListen;

  if (onReady && typeof onReady == "function") {
    // Let the user call listen when ready
    onReady.call(instance);
  } else {
    // Call listen ourselves
    heyListen(server, config);
  }
}

// Kick express into action
function heyListen(server, config) {
  server.listen(config.serverPort, function () {
      console.log(
        config.productInformation.title + ' Server started on ' +
        url.format({
          protocol: 'http',
          hostname: 'localhost',
          query: '',
          pathname: '',
          port: config.serverPort
        }) + NL
      );
    })
    .on('error', function (e) {
      console.log('Could not start server: ');
      if (e.code == 'EADDRINUSE') {
        console.log(' Port address already in use.');
      }
      console.log('  ' + e);
    });
}

module.exports = function (config, onReady) {
  // Capture logs
  serverLog.capture();

  // Form a response
  var instance = {};

  // Create server
  var server = express();

  // Load default for conig
  var config = require('./monitor/defaultConfig').merge(config);
  config.server = server;

  // Run first-time install checks, and then start server:
  var firstTimeInstall = require('./monitor/firstTimeInstall');
  firstTimeInstall.configure(config);
  firstTimeInstall.runChecks(function () {
    startServer(server, instance, config);
  });

  // Wait here
  return instance;
}
