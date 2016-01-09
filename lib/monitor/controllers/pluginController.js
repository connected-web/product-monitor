var find = require('promise-path').find;
var _ = require('lodash');
var pathParse = require('path-parse');

function configure(config) {
  var basePath = require('path').dirname(require.main.filename);
  var builtInPluginsDataPath = __dirname + '../../plugins';
  var userPluginsDataPath = basePath + '/' + config.userContentPath + '/plugins';

  function loadBuiltInPlugins(app) {
    console.log('[Built-in Plugins]');
    return loadPlugins(app, builtInPluginsDataPath)
      .then(() => console.log());
  }

  function loadUserPlugins(app) {
    console.log('[User Configured Plugins]');
    return loadPlugins(app, userPluginsDataPath)
      .then(() => console.log());
  }

  function loadPlugins(app, path) {
    return find(path + '/*.json')
      .then(readPlugins)
      .then((plugins) => applyPlugins(plugins, app))
      .then(summarisePlugins)
      .catch((ex) => console.log(ex, ex.stack));
  }

  function readPlugins(list) {
    return list.map(readPlugin);
  }

  function readPlugin(path) {
    try {
      var path = path;
      var plugin = require(path);
    } catch (ex) {
      console.log('Unable to load plugin', name, ex, ex.stack);
    }
    return {
      plugin,
      path
    };
  }

  function summarisePlugins(list) {
    return list.map(function (entry) {
      console.log(JSON.stringify(entry, null, '  '));
      return entry;
    });
  }

  function applyPlugins(list, app) {
    return list.map(function (entry) {
      return applyPlugin(entry, app);
    });
  }

  function applyPlugin(entry, app) {
    try {
      console.log(require.resolve(entry.plugin.library));
    } catch (ex) {
      console.log('[ERROR] Plugin ' + entry.plugin.library + ' could not be resolved');
      console.log('', 'Why not try: `npm install --save ' + entry.plugin.library + '`');
      console.log(ex.stack);
      entry.error = {
        message: 'Unable to resolve plugin',
        exception: ex
      };
      return entry;
    }

    try {
      var library = require(entry.plugin.library);
      var instance = library();
      var defaultConfig = instance.getConfig();
      var mergedConfig = _.merge({}, defaultConfig, entry.plugin.config || {});

      instance.setConfig(mergedConfig);
      instance.apply(app);
      entry.plugin.config = instance.getConfig();
      entry.success = true;
    } catch (ex) {
      console.log('Unable to load plugin', entry.path, ex, ex.stack);
      entry.error = {
        message: 'Unable to load plugin',
        exception: ex,
        stack: ex.stack
      };
    }
    return entry;
  }

  return {
    loadBuiltInPlugins,
    loadUserPlugins
  };
}

module.exports = {
  configure
};