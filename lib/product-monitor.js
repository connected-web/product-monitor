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

module.exports = function(config) {

  var instance = {};

  var config = require('./monitor/defaultConfig').merge(config);

  // Create server
  var server = express();

  // Permit CORS access to this server
  var corsSupport = require('./monitor/corsSupport');
  server.use(corsSupport);

  // Serve static files locally
  server.use('/monitoring/components', express.static(config.componentsPath));

  // Create controller
  var mainController = require('./monitor/mainController');
  mainController.configure(config);

  // Create index route
  server.get('/', mainController.render);

  // Create content route
  server.get('/environment/:contentPath', mainController.redirect);
  server.get('/:contentPath', mainController.render);

  // Create statusOf route
  var statusOfApi = require('./api/statusOf');
  statusOfApi.configure(config);
  server.get('/api/statusOf', statusOfApi.render);

  // Create generateStatusCode route
  var generateStatusCodeApi = require('./api/generateStatusCode');
  generateStatusCodeApi.configure(config);
  server.get('/api/generateStatusCode', generateStatusCodeApi.render);

  // Create monitorStatus route
  var monitorStatusApi = require('./api/monitorStatus');
  server.get('/api/monitorStatus', monitorStatusApi.render);

  // Create navigation route
  var navigationApi = require('./api/navigation');
  navigationApi.configure(config);
  server.get('/api/navigation', navigationApi.render);

  // Public API
  instance.server = server;

  instance.listen = function() {
    server.listen(config.serverPort, function() {
    	console.log(
    		'Product monitor available on ' +
    		url.format({
    			protocol: 'http',
    			hostname: 'localhost',
    			query: '',
    			pathname: '',
    			port: config.serverPort
    		})
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
