var monitor = require('product-monitor');

/* To use a custom config, loaded from a file, you could try:
  var defaultConfig = {};
  var customConfig = lazyLoad.json('myConfig.json', defaultConfig);
  var server = monitor(customConfig);
*/

var optionalServerConfig = {
  "productInformation": {
    "title": "Example Monitor"
  },
  "userContentPath": "user-content"
};

var server = monitor(optionalServerConfig);
