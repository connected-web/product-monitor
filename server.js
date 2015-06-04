/* Create a product monitor server with local content configuration */
var monitor = require('./lib/product-monitor');
var server = monitor({
  "serverPort": 8080,
  "componentsPath": "monitoring/components/",
  "contentPath": "monitoring/content/",
  "templatesPath": "monitoring/templates/",
  "statusCacheTimeInSeconds": 60
}).listen();
