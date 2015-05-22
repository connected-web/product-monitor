/*
 * Start this server using node.js using the command:
 * node product-monitor.js
 */

var serverPort = 8080;
var templates = 'monitoring/components/';

var express = require('express');
var url = require('url');
var fs = require('fs');

// Create server
var server = express();

// Create index route
server.get('/', function (req, res) {
	var templatePath = templates + 'index.html';
	var response = '';

	function loadComponent(name) {
		return fs.readFileSync(templates + name);
	}

	function loadComponents(path) {

		var components = [];
		var files = fs.readdirSync(templates).filter(function(file) {
			return file.match(/.*component.html/);
		});

		components = files.map(function(file) {
			return loadComponent(file);
		});

		return components;
	}

	fs.readFile(templatePath, {encoding: "UTF-8"}, function(err, data) {
		if(data) {
			var template = data;
			template = template.replace('${ENVIRONMENT}', 'development');

			var components = loadComponents(templates);

			template = template.replace('${COMPONENTS}', components.join("\n"));
			response = template;
		}
		else {
			response = 'Template not found: ' + templatePath;
		}
		res.send(response);
	});
});

server.use('/monitoring', express.static('monitoring'));

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
