/* Create a product monitor server with local content configuration */
var monitor = require('./lib/product-monitor');
var lazyLoad = require('./lib/monitor/lazyLoad');

var octoCreditsConfig = {
  accessToken: lazyLoad('./secret/github-access-token.js', false)
}

var server = monitor({
  "serverPort": 8080,
  "componentsPath": "monitoring/component/",
  "contentPath": "monitoring/content/",
  "templatesPath": "monitoring/templates/",
  "imagesPath": "images/",
  "statusCacheTimeInSeconds": 60,
  "octoCredits": octoCreditsConfig
}).listen();
