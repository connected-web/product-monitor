const path = require('path')
const defaultConfig = {}

function create () {
  let pluginConfig = defaultConfig

  function getConfig () {
    return pluginConfig
  }

  function setConfig (config) {
    pluginConfig = config
  }

  function info () {
    return require('../package.json')
  }

  function apply (app) {
    app.registerPluginAPIs(path.join(__dirname, '/../api'))
  }

  return {
    info,
    apply,
    getConfig,
    setConfig
  }
}

module.exports = create
