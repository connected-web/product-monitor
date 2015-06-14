/* Create a product monitor server with local content configuration */
var monitor = require('./lib/product-monitor');
var lazyLoad = require('./lib/monitor/lazyLoad');

var octoCreditsConfig = lazyLoad.json('./secret/github-access-token.json', { accessToken: false });

var server = monitor({
  "serverPort": 8080,
  "modulePath": "monitoring",
  "userContentPath": "monitoring",
  "statusCacheTimeInSeconds": 60,
  "octoCredits": octoCreditsConfig
});
