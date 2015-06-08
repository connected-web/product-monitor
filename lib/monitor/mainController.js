var fs = require('fs');
var componentMerger = require('./componentMerger');

var instance = function() {}

var contentPath = false;
var templatesPath = false;

function loadContent(name) {
  return fs.readFileSync(contentPath + name);
}

// Configure common variables
instance.configure = function (config) {
  var basePath = require('path').dirname(require.main.filename);
  contentPath = basePath + "/" + config.contentPath;
  templatesPath = basePath + "/" + config.templatesPath;

  componentMerger.configure(config);

  return this;
}

// Redirect old /environment/:environment paths
instance.redirect = function (req, res) {
  var contentPath = req.params.contentPath ? req.params.contentPath : 'index';
  res.redirect("/" + contentPath);
}

// Render content
instance.render = function (req, res) {
  var contentPath = req.params.contentPath ? req.params.contentPath : 'index';

  var templatePath = templatesPath + 'page-template.html';
  var response = '';

  // Load page template
  try {
    var template = fs.readFileSync(templatePath, {encoding: "UTF-8"});
  }
  catch(e) {
    res.status(500).send('Template file not found: ' + templatePath + '. If this is your server, please create this file. ' + e);
    return this;
  }

  // Load page content
  var contentFile = contentPath + '.content.html';
  try {
    var pageContent = loadContent(contentFile);
  }
  catch(e) {
    res.status(500).send('Content file not found: ' + contentFile + '. If this is your server, please create this file.');
    return this;
  }

  // Load components
  var componentContent = componentMerger.mergeAll();

  // Replace variables in template
  template = template.replace('{{COMPONENT-TEMPLATES}}', componentContent);
  template = template.replace('{{PAGE-CONTENT}}', pageContent);

  response = template;

  res.send(response);

  return this;
}

module.exports = instance;
