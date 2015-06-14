/*
To use this module, create an server.js file containing:
```js
var monitor = require('product-monitor');
var server = monitor().listen();
```
Then run ```node server.js```
*/

var url = require('url');
var express = require('express');
var NL = "\n";

module.exports = function(config) {

  var instance = {};

  // Create server
  var server = express();

  // Load default for conig
  var config = require('./monitor/defaultConfig').merge(config);
  config.server = server;

  // Run first-time install checks, because it might be first-time every-time!
  var firstTimeInstall = require('./monitor/firstTimeInstall');
  firstTimeInstall.configure(config);
  firstTimeInstall.runChecks();

  // Permit CORS access to this server
  var corsSupport = require('./monitor/corsSupport');
  server.use(corsSupport);

  // Create main controller
  var mainController = require('./monitor/mainController');
  mainController.configure(config);

  // Create API controller
  var apiController = require('./monitor/apiController');
  apiController.configure(config);

  // Register Server API routes
  apiController.registerServerAPIs();

  // Register User API routes
  apiController.registerUserAPIs();

  // Create user index route
  server.get('/', mainController.renderUserContent);

  // Create user content route
  server.get('/content/:contentPath',  mainController.renderUserContent);

  // Create documentation routes
  server.get('/docs/api', mainController.createRenderFunctionFor('documentation/api.fragment.html'));
  server.get('/docs/component-showcase', mainController.createRenderFunctionFor('documentation/component-showcase.fragment.html'));
  server.get('/docs/create-your-own', mainController.createRenderFunctionFor('documentation/create-your-own.fragment.html'));
  server.get('/docs/custom-components-guide', mainController.createRenderFunctionFor('documentation/custom-components-guide.fragment.html'));
  server.get('/docs/credits', mainController.createRenderFunctionFor('documentation/credits.fragment.html'));
  server.get('/status', mainController.createRenderFunctionFor('documentation/status.fragment.html'));

  // Serve static files locally
  server.use('/favicon.ico', express.static(config.modulePath + "/images/favicon.ico"));
  server.use('/images', express.static(config.modulePath + "/images"));

  // Public API
  instance.server = server;

  instance.listen = function() {
    server.listen(config.serverPort, function() {
    	console.log(
    		'Product monitor started on ' +
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

  return instance;
}
