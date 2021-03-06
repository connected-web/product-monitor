var fs = require('fs')
var pathParse = require('path-parse')
var htmlPageTemplate = require('../htmlPageTemplate')
var NL = '\n'

// Configure common variables
function configure (config) {
  const instance = {}

  const serverConfig = config
  const basePath = require('path').dirname(require.main.filename)
  const userContentPath = basePath + '/' + config.userContentPath + '/content'
  const pageTemplate = htmlPageTemplate.configure(config)

  function loadFile (path) {
    var content = false
    try {
      content = fs.readFileSync(path)
    } catch (e) {
      content = false
    }
    return content
  }

  // Render page content
  function renderPageContent (contentPath, contentFilePath, req, res) {
    // Load page content
    var pageFragment = loadFile(contentFilePath)

    // Check that file exists
    var pathInfo = pathParse(contentFilePath)
    if (pathInfo.base === ':contentPath.content.html') {
      pageFragment = '<jumbotron>Not a real page</jumbotron>'
    } else if (pageFragment === false) {
      console.log('[Content Warning] pageController.renderPageContent, file not found: ', contentFilePath, pathInfo.base, NL)
      res.status(404)
      pageFragment = '<jumbotron><h2>Page not found</h2><p>The file <b>:filePath</b> was not found on server.</p></jumbotron>'.replace(':filePath', pathInfo.base)
    }

    // Create context for rendering content
    var editable = (contentPath) ? req.isAuthenticated() && req.user : false
    var pageConfig = {
      serverConfig,
      pageFragment,
      contentPath,
      editable
    }

    // Render page using server config with page fragment
    var response = pageTemplate.render(pageConfig)

    // Send response
    res.send(response)
  }

  // Render module page
  instance.createRenderFunctionFor = function (filePath) {
    return function (req, res) {
      renderPageContent(false, filePath, req, res)
    }
  }

  // Read user content as JSON
  instance.readUserContent = function (req, res) {
    const contentPath = req.params.contentPath ? req.params.contentPath : false
    const response = {
      path: contentPath,
      file: contentPath + '.content.html'
    }

    if (response.path) {
      const pageFragment = loadFile(userContentPath + '/' + response.file)

      if (pageFragment) {
        response.body = pageFragment + ''
        res.status(200).json(response)
      } else {
        response.error = true
        response.message = 'No content, or file not found.'
        res.status(500).json(response)
      }
    } else {
      response.error = true
      response.message = 'No content path set to read from.'
      res.status(403).json(response)
    }
  }

  // Save user content using JSON
  instance.saveUserContent = function (req, res) {
    var response = {}
    var contentPath = req.params.contentPath ? req.params.contentPath : false
    var contentFile = contentPath + '.content.html'
    var filePath = userContentPath + '/' + contentFile

    if (contentPath) {
      var content = req.body.content
      if (content) {
        response.error = false
        response.received = req.body
        response.path = contentPath

        fs.writeFile(filePath, req.body.content, function (error) {
          if (error) {
            response.error = error
            response.message = 'Error saving content to file: ' + JSON.stringify(error)
            res.status(500).json(response)
          } else {
            response.message = 'Content saved to file!'
            res.status(200).json(response)
          }
        })
      } else {
        response.error = true
        response.message = 'No content property found in POST body.'
        res.status(403).json(response)
      }
    } else {
      response.error = true
      response.message = 'No content path set to save to.'
      res.status(403).json(response)
    }
  }

  // Render user content page
  instance.renderUserContent = function (req, res) {
    var contentPath = req.params.contentPath ? req.params.contentPath : 'index'
    var contentFile = contentPath + '.content.html'
    var filePath = userContentPath + '/' + contentFile

    renderPageContent(contentPath, filePath, req, res)
  }

  return instance
}

module.exports = {
  configure
}
