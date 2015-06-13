var fs = require('fs');

var instance = function() {}

var contentPath = false;
var pageTemplate = false;

function loadContent(name) {
  var content = false;
  try {
    content = fs.readFileSync(contentPath + name);
  }
  catch(e) {
    content = false;
  }
  return content;
}

function renderPageContent(contentFile, res) {
  // Load page content
  var pageContent = loadContent(contentFile);

  if(pageContent == false) {
    res.status(500).send('Content file not found: ' + contentFile + '. If this is your server, please create this file.');
    return this;
  }

  var response = pageTemplate.replace('{{page-content}}', pageContent);

  res.send(response);
}

// Configure common variables
instance.configure = function (config) {
  var basePath = require('path').dirname(require.main.filename);
  contentPath = basePath + "/" + config.contentPath;

  pageTemplate = require('./htmlPageTemplate.js').configure(config).render();

  return this;
}

// Redirect old /environment/:environment paths
instance.redirect = function (req, res) {
  var contentPath = req.params.contentPath ? req.params.contentPath : 'index';
  res.redirect("/" + contentPath);
}

// Render api page
instance.renderApiPage = function(req, res) {
  renderPageContent('api.fragment.html', res);
}

// Render credits page
instance.renderCreditsPage = function(req, res) {
  renderPageContent('credits.fragment.html', res);
}

// Render credits page
instance.renderStatusPage = function(req, res) {
  renderPageContent('status.fragment.html', res);
}

// Render content
instance.render = function (req, res) {
  var contentPath = req.params.contentPath ? req.params.contentPath : 'index';
  var contentFile = contentPath + '.content.html';

  renderPageContent(contentFile, res);
}

module.exports = instance;
