var endpoint = function () {}

endpoint.route = '/api/packageInfo';
endpoint.description = 'Returns the contents of the `product-monitor` package.json file.';

var packageJson = false;

endpoint.configure = function (config) {
  var modulePath = config.modulePath + '/../';
  try {
    packageJson = require(modulePath + 'package.json');
  } catch (ex) {
    packageJson = {
      error: 'package.json unavailable'
    };
  }
}

endpoint.render = function (req, res) {
  res.jsonp(packageJson);
}

module.exports = endpoint;