const users = require('./users')

const defaultStoragePath = require('path').dirname(require.main.filename) + '/users'
const defaultConfig = {
  storagePath: defaultStoragePath
}

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
    return users(pluginConfig.storagePath)
      .then(function (api) {
        app.users = api
      })
  }

  return {
    info,
    apply,
    getConfig,
    setConfig
  }
}

module.exports = create
