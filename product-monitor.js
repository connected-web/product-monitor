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
  var fs = require('fs');
  var express = require('express');

  var config = merge({
    "serverPort": 8080,
    "componentsPath": "node_modules/product-monitor/monitoring/components/",
    "contentPath": "node_modules/product-monitor/monitoring/content/"
  }, config || {});

  var serverPort = config.serverPort;
  var componentsPath = config.componentsPath;
  var contentPath = config.contentPath;

  // Create server
  var server = express();

  // Permit CORS access to this server
  server.use(function(req, res, next) {
    var origin = req.get('origin');
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    next();
  });

  // Render content
  function renderPageContent(req, res) {

  	var environment = req.params.environment ? req.params.environment : 'index';

  	var templatePath = componentsPath + 'page-template.html';
  	var response = '';

  	function loadComponent(name) {
  		return fs.readFileSync(componentsPath + name);
  	}

  	function loadContent(name) {
  		return fs.readFileSync(contentPath + name);
  	}

  	function loadComponents(path) {

  		var components = [];
  		var files = fs.readdirSync(componentsPath).filter(function(file) {
  			return file.match(/.*component.html/);
  		});

  		components = files.map(function(file) {
  			return loadComponent(file);
  		});

  		return components;
  	}

  	// Load page template
  	try {
  		var template = fs.readFileSync(templatePath, {encoding: "UTF-8"});
  	}
  	catch(e) {
  		return res.status(500).send('Template file not found: ' + templatePath + '. If this is your server, please create this file.');
  	}

  	// Load components
  	try {
  		var components = loadComponents(componentsPath);
  	}
  	catch(e) {
  		return res.status(500).send('Error loading components. If this is your server, please check that the component directory exists.');
  	}

  	// Load page content
  	var contentFile = environment + '.content.html';
  	try {
  		var pageContent = loadContent(contentFile);
  	}
  	catch(e) {
  		return res.status(500).send('Content file not found: ' + contentFile + '. If this is your server, please create this file.');
  	}

  	// Replace variables in template
  	template = template.replace('${COMPONENTS}', components.join("\n"));
  	template = template.replace('${PAGE_CONTENT}', pageContent);
  	template = template.replace('${ENVIRONMENT}', environment);

  	response = template;

  	res.send(response);
  }

  // Create index route
  server.get('/', renderPageContent);

  // Create content route
  server.get('/environment/:environment', renderPageContent);

  // Create statusOf route
  var statusOf = require('./lib/api/statusOf');
  server.get('/api/statusOf', statusOf);

  // Public API
  instance.server = server;

  instance.listen = function()
  {
    // Starting listening for requests...
    server.listen(serverPort, function() {
    	console.log(
    		'Product monitor available on ' +
    		url.format({
    			protocol: 'http',
    			hostname: 'localhost',
    			query: '',
    			pathname: '',
    			port: serverPort
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
