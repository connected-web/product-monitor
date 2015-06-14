var lazyLoad = require('../monitor/lazyLoad');

var instance = function() {}

instance.route = '/api/packageInfo';

var packageJson = false;

instance.configure = function(config) {
  var modulePath = config.modulePath + "/../";
  packageJson = lazyLoad.json(modulePath + "package.json", {
    error: "package.json unavailable"
  });
}

instance.render = function(req, res) {
  res.jsonp(packageJson);
}

module.exports = instance;
