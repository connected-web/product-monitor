var fs = require('fs');
var componentMerger = require('./componentMerger');

var instance = {};

var template = false;
var templatePath = '';

instance.configure = function(config) {
  var basePath = require('path').dirname(require.main.filename);
  templatePath = basePath + '/' + config.modulePath + '/templates/page-template.html';

  componentMerger.configure(config);

  return this;
}

function loadFile() {
  // Load page template
  try {
    template = fs.readFileSync(templatePath, {encoding: "UTF-8"});
  }
  catch(e) {
    template = 'Template file not found: ' + templatePath + '. If this is your server, please create this file. ' + e;
  }

  return template;
}

function renderPageTemplate() {
  var template = loadFile();

  template = template.replace('{{component-templates}}', componentMerger.mergeAll());

  return template;
}

instance.render = function() {
  template = template || renderPageTemplate();

  return template;
}

module.exports = instance;
