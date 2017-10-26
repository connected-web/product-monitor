const path = require('path')
const pathParse = require('path-parse')
const _ = require('lodash')
const { find } = require('promise-path')
const pluginsModel = require('../models/plugins')

function configure (config) {
  var basePath = path.dirname(require.main.filename)
  var builtInPluginsDataPath = path.join(__dirname, '/../../plugins')
  var userPluginsDataPath = basePath + '/' + config.userContentPath + '/plugins'

  function loadBuiltInPlugins (app) {
    console.log('[Built-in Plugins]')
    return loadPlugins(app, builtInPluginsDataPath, pluginsModel.builtIn)
      .then(() => console.log())
  }

  function loadUserPlugins (app) {
    console.log('[User Configured Plugins]')
    return loadPlugins(app, userPluginsDataPath, pluginsModel.userConfigured)
      .then(() => console.log())
  }

  function loadPlugins (app, path, storageModel) {
    return find(path + '/*.json')
      .then(readPlugins)
      .then((plugins) => applyPlugins(plugins, app))
      .then((list) => storePlugins(list, storageModel))
      .then(summarisePlugins)
      .catch((ex) => console.log(ex, ex.stack))
  }

  function readPlugins (list) {
    return list.map(readPlugin)
  }

  function readPlugin (path) {
    var info = pathParse(path)
    var error
    try {
      var plugin = require(path)
      plugin = _.merge({
        enabled: true
      }, plugin)
    } catch (ex) {
      console.log('[Plugin Controller] Unable to load plugin', info.name, ex, ex.stack)
      plugin = {
        library: 'unreadable',
        config: 'unreadable',
        enabled: false
      }
      plugin.enabled = false
      error = {
        message: 'Unable to load plugin: ' + info.name,
        exception: ex + ''
      }
    }
    return {
      plugin,
      path,
      info,
      error
    }
  }

  function storePlugins (list, storageModel) {
    list.forEach(function (entry) {
      storageModel.push(entry)
    })
    return list
  }

  function summarisePlugins (list) {
    return list.map(function (entry) {
      console.log('', entry.plugin.library)
      return entry
    })
  }

  function applyPlugins (list, app) {
    return Promise.all(
      list.map(function (entry) {
        return applyPlugin(entry, app)
      })
    )
  }

  function localize (entry) {
    var library = entry.plugin.library || 'undefined'
    return (/^(local\.).*/).test(library) ? library.replace('local.', entry.info.dir + '/') : library
  }

  function applyPlugin (entry, app) {
    if (entry.error) {
      return entry
    } else if (entry.plugin.enabled === false) {
      entry.error = {
        message: 'Plugin disabled'
      }
      return entry
    } else {
      var libraryPath = localize(entry)
      entry.plugin.localized = libraryPath

      try {
        require.resolve(libraryPath)
      } catch (ex) {
        console.log('[Plugin Controller] Error: Plugin ' + libraryPath + ' could not be resolved')
        if (libraryPath.indexOf('/') !== 0) {
          console.log('', 'You could try: `npm install --save ' + libraryPath + '`')
        }
        console.log(ex.stack)
        entry.error = {
          message: 'Unable to resolve plugin',
          exception: ex + ''
        }
        return entry
      }
      try {
        var library = require(libraryPath)
        var instance = library()
        var defaultConfig = instance.getConfig()
        var mergedConfig = _.merge({}, defaultConfig, entry.plugin.config || {})

        instance.setConfig(mergedConfig)
        instance.apply(app)
        entry.plugin.config = instance.getConfig()
        entry.success = true
      } catch (ex) {
        console.log('[Plugin Controller] Unable to load plugin', entry.path, ex, ex.stack)
        entry.error = {
          message: 'Unable to load plugin',
          exception: ex + '',
          stack: ex.stack
        }
      }
    }

    return entry
  }

  return {
    loadBuiltInPlugins,
    loadUserPlugins
  }
}

module.exports = {
  configure
}
