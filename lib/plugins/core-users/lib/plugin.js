var users = require('./users');

var defaultStoragePath = require('path').dirname(require.main.filename) + '/users';
var defaultConfig = {
  storagePath: defaultStoragePath
};

function create() {
  var pluginConfig = defaultConfig;

  function getConfig() {
    return pluginConfig;
  }

  function setConfig(config) {
    pluginConfig = config;
  }

  function info() {
    return require('../package.json');
  }

  function apply(app) {
    var server = app.server;

    return users(pluginConfig.storagePath)
      .then(function (api) {
        app.users = api;
      });
  }

  return {
    info,
    apply,
    getConfig,
    setConfig
  };
}

module.exports = create;