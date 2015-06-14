var merge = require('utils-merge');

var instance = function() {};

var defaultConfig = {
  "serverPort": 8080,
  "modulePath": "node_modules/product-monitor/",
  "userContentPath": "node_modules/product-monitor/",
  "statusCacheTimeInSeconds": 300,
  "octoCredits": {
    "accessToken": false
  }
};

instance.merge = function(config) {
  return merge(defaultConfig, config || {});
}

module.exports = instance;
