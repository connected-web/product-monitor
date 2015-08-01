var fs = require('fs');
var pathParse = require('path-parse');
var NL = "\n";

var instance = function () {}

var serverConfig = false;
var useContentPath = false;
var pageTemplate = false;
var productTitle = false;

// Configure common variables
instance.configure = function (config) {
  serverConfig = config;
  var basePath = require('path').dirname(require.main.filename);
  userContentPath = basePath + '/' + config.userContentPath + '/content';

  pageTemplate = require('./htmlPageTemplate.js').configure(config);

  return this;
}

function loadFile(path) {
  var content = false;
  try {
    content = fs.readFileSync(path);
  } catch (e) {
    content = false;
  }
  return content;
}

// Render module page
instance.createRenderFunctionFor = function (filePath) {
  return function (req, res) {
    renderPageContent(false, filePath, res);
  };
}

// Read user content as JSON
instance.readUserContent = function(req, res) {
  var response = {};
  var requestPath = req.params.contentPath ? req.params.contentPath : false;
  if(requestPath) {
    response.error = true;
    response.message = 'Read user content not implemented yet';
    res.status(500).json(response);
  }
  else {
    response.error = true;
    response.message = 'No content path set to read from.';
    res.status(403).json(response);
  }
}

// Save user content using JSON
instance.saveUserContent = function(req, res) {
  var response = {};
  var requestPath = req.params.contentPath ? req.params.contentPath : false;
  if(requestPath) {
    response.error = true;
    response.message = 'Save user content not implemented yet';
    res.status(500).json(response);
  }
  else {
    response.error = true;
    response.message = 'No content path set to save to.';
    res.status(403).json(response);
  }
}

// Render user content page
instance.renderUserContent = function (req, res) {
  var contentPath = req.params.contentPath ? req.params.contentPath : 'index';
  var contentFile = contentPath + '.content.html';
  var filePath = userContentPath + '/' + contentFile;

  renderPageContent(contentPath, filePath, res);
}

// Render page content
function renderPageContent(contentPath, contentFilePath, res) {
  // Load page content
  var pageFragment = loadFile(contentFilePath);

  // Check that file exists
  if (pageFragment === false) {
    var pathInfo = pathParse(contentFilePath);
    console.log('[Content Warning] mainController.renderPageContent, file not found: ', contentFilePath, pathInfo.base, NL);
    res.status(404);
    pageFragment = '<jumbotron><h2>Page not found</h2><p>The file <b>:filePath</b> was not found on server.</p></jumbotron>'.replace(':filePath', pathInfo.base);
  }

  // Create context for rendering content
  var pageConfig = {
    serverConfig: serverConfig,
    pageFragment: pageFragment,
    contentPath: contentPath,
    editable: (contentPath) ? true : false
  }

  // Render page using server config with page fragment
  var response = pageTemplate.render(pageConfig);

  // Send response
  res.send(response);
}

module.exports = instance;
