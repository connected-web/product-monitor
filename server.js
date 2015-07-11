/* Create a product monitor server with local content configuration */
var monitor = require('./lib/product-monitor');
var lazyLoad = require('./lib/monitor/lazyLoad');

var octoCreditsConfig = lazyLoad.json('./secret/github-access-token.json', { accessToken: false });

var server = monitor({
  "serverPort": 8080,
  "modulePath": "monitoring",
  "userContentPath": "user-content",
  "apiCache": {
    debug: false,
    enabled: true,
    defaultDuration: 300000 // in ms, 300 seconds, 5 minutes
  },
  "octoCredits": octoCreditsConfig,
  "productInformation": {
    "title": "Dev Monitor"
  }
});
