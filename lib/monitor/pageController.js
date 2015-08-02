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
  var contentPath = req.params.contentPath ? req.params.contentPath : false;
  var contentFile = contentPath + '.content.html';
  var filePath = userContentPath + '/' + contentFile;

  response.path = contentPath;
  response.file = contentFile;

  if(contentPath) {
    var contentFile = contentPath + '.content.html';
    var pageFragment = loadFile(filePath);

    if(pageFragment) {
      response.body = pageFragment + '';
      res.status(200).json(response);
    }
    else {
      response.error = true;
      response.message = 'No content, or file not found.';
      res.status(500).json(response);
    }
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
  var contentPath = req.params.contentPath ? req.params.contentPath : false;
  var contentFile = contentPath + '.content.html';
  var filePath = userContentPath + '/' + contentFile;

  if(contentPath) {
    var content = req.body.content;
    if(content) {
      response.error = false;
      response.received = req.body;
      response.path = contentPath;

      fs.writeFile(filePath, req.body.content, function(error) {
        if(error) {
          response.error = error;
          response.message = 'Error saving content to file: ' + JSON.stringify(error);
          res.status(500).json(response);
        }
        else {
          response.message = 'Content saved to file!';
          res.status(200).json(response);
        }
      });
    }
    else {
      response.error = true;
      response.message = 'No content property found in POST body.';
      res.status(403).json(response);
    }
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
