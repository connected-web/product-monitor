var createDocumentationRoutes = require('./createDocumentationRoutes');

var defaultConfig = {};

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
    return createDocumentationRoutes(app);
  }

  return {
    info,
    apply,
    getConfig,
    setConfig
  };
}

module.exports = create;