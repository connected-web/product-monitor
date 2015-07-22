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
    renderPageContent(filePath, res);
  };
}

// Render user content page
instance.renderUserContent = function (req, res) {
  var requestPath = req.params.contentPath ? req.params.contentPath : 'index';
  var contentFile = requestPath + '.content.html';
  var filePath = userContentPath + '/' + contentFile;

  renderPageContent(filePath, res);
}

// Render page content
function renderPageContent(contentFilePath, res) {
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
    pageFragment: pageFragment
  }

  // Render page using server config with page fragment
  var response = pageTemplate.render(pageConfig);

  // Send response
  res.send(response);
}

module.exports = instance;
