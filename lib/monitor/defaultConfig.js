var merge = require('utils-merge');

var instance = function() {};

var defaultConfig = {
  "serverPort": 8080,
  "modulePath": "node_modules/product-monitor/monitoring",
  "userContentPath": "user-content",
  "apiCache": {
    debug: false,
    enabled: true,
    defaultDuration: 3600000 // in ms, 3600 seconds, 1 hour
  },
  "octoCredits": {
    "accessToken": false
  },
  "productInformation": {
    "title": "Product Monitor"
  }
};

instance.merge = function(config) {
  return merge(defaultConfig, config || {});
}

module.exports = instance;
