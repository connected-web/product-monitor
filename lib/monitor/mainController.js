var fs = require('fs');

var instance = function() {}

var moduleContentPath = false;
var useContentPath = false;
var pageTemplate = false;

// Configure common variables
instance.configure = function (config) {
  var basePath = require('path').dirname(require.main.filename);
  moduleContentPath = basePath + "/" + config.modulePath;
  userContentPath = basePath + "/" + config.userContentPath + "/content";

  pageTemplate = require('./htmlPageTemplate.js').configure(config).render();

  return this;
}

function loadModuleContent(name) {
  return loadFile(moduleContentPath + name);
}

function loadUserContent(name) {
  return loadFile(userContentPath + name);
}

function loadFile(path) {
  var content = false;
  try {
    content = fs.readFileSync(path);
  }
  catch(e) {
    content = false;
  }
  return content;
}

// Render module page
instance.createRenderFunctionFor = function (moduleFilePath) {
  return function(req, res) {
    var filePath = moduleContentPath + "/" + moduleFilePath;
    renderPageContent(filePath, res);
  };
}

// Render user content page
instance.renderUserContent = function (req, res) {
  var requestPath = req.params.contentPath ? req.params.contentPath : 'index';
  var contentFile = requestPath + '.content.html';
  var filePath = userContentPath + "/" + contentFile;

  renderPageContent(filePath, res);
}

// Render page content
function renderPageContent(contentFilePath, res) {
  // Load page content
  var pageContent = loadFile(contentFilePath);

  // Check that file exists
  if(pageContent == false) {
    console.log("mainController.renderPageContent, file not found: " + contentFilePath)
    res.status(500).send('Content file not found: ' + contentFilePath + '. If this is your server, please create this file.');
    return this;
  }

  // Render page using HTML template
  var response = pageTemplate.replace('{{page-content}}', pageContent);

  // Send response
  res.send(response);
}

module.exports = instance;
