var fs = require('fs');

module.exports = (function() {

  var instance = {};

  var componentsPath = false;
  var contentPath = false;
  var templatesPath = false;

  // Configure common variables
  instance.configure = function (config) {
    var basePath = require('path').dirname(require.main.filename);
    componentsPath = basePath + "/" + config.componentsPath;
    contentPath = basePath + "/" + config.contentPath;
    templatesPath = basePath + "/" + config.templatesPath;

    return this;
  }

  // Render content
  instance.render = function (req, res) {
    var environment = req.params.environment ? req.params.environment : 'index';

    var templatePath = templatesPath + 'page-template.html';
    var response = '';

    function loadComponent(name) {
      return fs.readFileSync(componentsPath + name);
    }

    function loadContent(name) {
      return fs.readFileSync(contentPath + name);
    }

    function loadComponents(path) {

      var components = [];
      var files = fs.readdirSync(componentsPath).filter(function(file) {
        return file.match(/.*component.html/);
      });

      components = files.map(function(file) {
        return loadComponent(file);
      });

      return components;
    }

    // Load page template
    try {
      var template = fs.readFileSync(templatePath, {encoding: "UTF-8"});
    }
    catch(e) {
      res.status(500).send('Template file not found: ' + templatePath + '. If this is your server, please create this file. ' + e);
      return this;
    }

    // Load components
    try {
      var components = loadComponents(componentsPath);
    }
    catch(e) {
      res.status(500).send('Error loading components. If this is your server, please check that the component directory exists.');
      return this;
    }

    // Load page content
    var contentFile = environment + '.content.html';
    try {
      var pageContent = loadContent(contentFile);
    }
    catch(e) {
      res.status(500).send('Content file not found: ' + contentFile + '. If this is your server, please create this file.');
      return this;
    }

    // Replace variables in template
    template = template.replace('${COMPONENTS}', components.join("\n"));
    template = template.replace('${PAGE_CONTENT}', pageContent);
    template = template.replace('${ENVIRONMENT}', environment);

    response = template;

    res.send(response);

    return this;
  }

  return instance;
})();
