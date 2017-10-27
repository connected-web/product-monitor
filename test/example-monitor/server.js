const monitor = require('product-monitor')

/* To use a custom config, loaded from a file, you could try:
  var customConfig = require('./myConfig.json');
  var server = monitor(customConfig);
*/

const optionalServerConfig = {
  'productInformation': {
    'title': 'Example Monitor'
  },
  'userContentPath': 'user-content'
}

monitor(optionalServerConfig)
