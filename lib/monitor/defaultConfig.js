var merge = require('utils-merge')

var instance = function () {}

var basePath = require('path').dirname(require.main.filename)

var defaultConfig = {
  'serverPort': 8080,
  'ipAddress': '0.0.0.0',
  'modulePath': 'node_modules/product-monitor/monitoring',
  'userContentPath': 'user-content',
  'apiCache': {
    'debug': false,
    'enabled': true,
    'defaultDuration': 3600000 // in ms, 3600 seconds, 1 hour
  },
  'octoCredits': {
    'accessToken': false
  },
  'productInformation': {
    'title': 'Product Monitor'
  },
  'npmUpdate': {
    'disableUpdates': false
  },
  'basePath': basePath
}

instance.merge = function (config) {
  return merge(defaultConfig, config || {})
}

module.exports = instance
