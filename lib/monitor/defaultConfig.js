var merge = require('utils-merge');

var instance = function() {};

var defaultConfig = {
  "serverPort": 8080,
  "componentsPath": "node_modules/product-monitor/monitoring/components/",
  "contentPath": "node_modules/product-monitor/monitoring/content/",
  "templatesPath": "node_modules/product-monitor/monitoring/templates/",
  "imagesPath": "node_modules/product-monitor/images/",
  "statusCacheTimeInSeconds": 300
};

instance.merge = function(config) {
  return merge(defaultConfig, config || {});
}

module.exports = instance;
