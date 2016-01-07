var find = require('promise-path').find;
var pathParse = require('path-parse');

function configure(config) {
  var basePath = require('path').dirname(require.main.filename);
  var pluginsPath = basePath + '/' + config.userContentPath + '/plugins';

  function loadPlugins(instance) {
    console.log('[Plugins]');
    return find(pluginsPath + '/*/')
      .then(namePlugins)
      .then(readPlugins)
      .then(summarisePlugins)
      .then((plugins) => applyPlugins(plugins, instance))
      .then(() => setTimeout(console.log, 1))
      .catch((ex) => console.log(ex, ex.stack));
  }

  function namePlugins(folders) {
    return folders.map((folder) => pathParse(folder).name);
  }

  function readPlugins(list) {
    return list.map(readPlugin);
  }

  function readPlugin(name) {
    try {
      var path = '/' + config.userContentPath + '/plugins/' + name;
      var plugin = require(pluginsPath + '/' + name + '/' + name + '-plugin.js');
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
      console.log('', '', entry.path);
      return entry;
    });
  }

  function applyPlugins(list, instance) {
    return list.map(function (entry) {
      try {
        setTimeout(entry.plugin.apply, 1, instance);
      } catch (ex) {
        console.log('Unable to load plugin', entry.path, ex, ex.stack);
      }
      return entry;
    });
  }

  return {
    loadPlugins
  };
}

module.exports = {
  configure
};