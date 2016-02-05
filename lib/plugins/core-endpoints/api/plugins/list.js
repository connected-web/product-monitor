var fs = require('fs');

var endpoint = {};

var pluginsModel;

endpoint.route = '/api/plugins/list';
endpoint.description = 'Provides a list of built-in and user-configured plugins currently installed';
endpoint.cacheDuration = '10 seconds';
endpoint.rolesRequired = ['administrator'];

endpoint.configure = function (config) {
  pluginsModel = config.models.plugins || {};
}

endpoint.render = function (req, res) {
  res.jsonp({
    types: [{
      name: 'User Configured',
      list: pluginsModel.userConfigured || []
    }, {
      name: 'Built In',
      list: pluginsModel.builtIn || []
    }]
  });
}

module.exports = endpoint;