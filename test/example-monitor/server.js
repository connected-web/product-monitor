var monitor = require('product-monitor')

/* To use a custom config, loaded from a file, you could try:
  var customConfig = require('./myConfig.json');
  var server = monitor(customConfig);
*/

var optionalServerConfig = {
  'productInformation': {
    'title': 'Example Monitor'
  },
  'userContentPath': 'user-content'
}

var server = monitor(optionalServerConfig)
