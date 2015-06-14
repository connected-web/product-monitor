var lazyLoad = require('../monitor/lazyLoad');

var instance = function() {}

instance.route = '/api/packageInfo';

var packageJson = false;

instance.configure = function(config) {
  packageJson = lazyLoad.json("package.json", {
    error: "package.json unavailable"
  });
}

instance.render = function(req, res) {
  res.jsonp(packageJson);
}

module.exports = instance;
