var find = require('promise-path').find;
var _ = require('lodash');
var pathParse = require('path-parse');

function configure(config) {
  var basePath = require('path').dirname(require.main.filename);
  var pluginDataPath = basePath + '/' + config.userContentPath + '/plugins';

  function loadPlugins(app) {
    console.log('[Plugins]');
    return find(pluginDataPath + '/*.json')
      .then(readPlugins)
      .then((plugins) => applyPlugins(plugins, app))
      .then(summarisePlugins)
      .then(() => setTimeout(console.log, 1))
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
    loadPlugins
  };
}

module.exports = {
  configure
};