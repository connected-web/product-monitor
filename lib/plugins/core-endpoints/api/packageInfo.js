var endpoint = function () {}

endpoint.route = '/api/packageInfo'
endpoint.description = 'Returns the contents of the `product-monitor` package.json file.'
endpoint.rolesRequired = ['administrator']

var packageJson = false

endpoint.configure = function (config) {
  var modulePath = require('path').dirname(require.main.filename) + '/' + config.modulePath + '/../'
  try {
    packageJson = require(modulePath + 'package.json')
  } catch (ex) {
    console.log('Unable to load package.json', modulePath)
    packageJson = {
      error: 'package.json unavailable'
    }
  }
}

endpoint.render = function (req, res) {
  res.jsonp(packageJson)
}

module.exports = endpoint
