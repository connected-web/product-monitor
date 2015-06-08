/* Create a product monitor server with local content configuration */
var monitor = require('./lib/product-monitor');
var server = monitor({
  "serverPort": 8080,
  "componentsPath": "monitoring/component/",
  "contentPath": "monitoring/content/",
  "templatesPath": "monitoring/templates/",
  "imagesPath": "images/",
  "statusCacheTimeInSeconds": 60
}).listen();
