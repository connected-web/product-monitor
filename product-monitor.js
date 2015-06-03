/*
To use this module, create an server.js file containing:
```js
var monitor = require('product-monitor');
var server = monitor().listen();
```
Then run ```node server.js```
*/
module.exports = function(config) {

  var instance = {};
  var merge = require('utils-merge');
  var url = require('url');
  var express = require('express');

  var config = merge({
    "serverPort": 8080,
    "componentsPath": "node_modules/product-monitor/monitoring/components/",
    "contentPath": "node_modules/product-monitor/monitoring/content/"
  }, config || {});

  // Create server
  var server = express();

  // Permit CORS access to this server
  var corsSupport = require('./lib/monitor/corsSupport');
  server.use(corsSupport);

  // Create controller
  var mainController = require('./lib/monitor/mainController');
  mainController.configure(config);

  // Create index route
  server.get('/', mainController.render);

  // Create content route
  server.get('/environment/:environment', mainController.render);

  // Create statusOf route
  var statusOf = require('./lib/api/statusOf');
  server.get('/api/statusOf', statusOf);

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
