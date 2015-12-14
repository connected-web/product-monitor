var lazyLoad = require('../monitor/lazyLoad');

var instance = function() {}

instance.route = '/api/packageInfo';
instance.description = 'Returns the contents of the `product-monitor` package.json file.';

var packageJson = false;

instance.configure = function(config) {
  var modulePath = config.modulePath + '/../';
  packageJson = lazyLoad.json(modulePath + 'package.json', {
    error: 'package.json unavailable'
  });
}

instance.render = function(req, res) {
  res.jsonp(packageJson);
}

module.exports = instance;
