var monitor = require('./product-monitor');
var server = monitor({
  "serverPort": 8080,
  "componentsPath": "monitoring/components/",
  "contentPath": "monitoring/content/"
}).listen();
