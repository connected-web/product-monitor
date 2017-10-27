var fs = require('fs')
var handlebars = require('handlebars')
var componentMerger = require('./componentMerger')

var instance = {}

var template = false
var templatePath = ''
var componentTemplates = false

instance.configure = function (config) {
  var basePath = require('path').dirname(require.main.filename)
  templatePath = basePath + '/' + config.userContentPath + '/templates/page-template.html'

  componentMerger.configure(config)
  componentTemplates = componentMerger.mergeAll()

  componentTemplates = componentTemplates.replace(/{{serverConfig.userContentPath}}/g, config.userContentPath)
  componentTemplates = componentTemplates.replace(/{{serverConfig.productInformation.title}}/g, config.productInformation.title)

  var templateSource = loadTemplate()
  template = handlebars.compile(templateSource)

  return this
}

function loadTemplate () {
  // Load page template
  try {
    template = fs.readFileSync(templatePath, 'utf8')
  } catch (e) {
    template = 'Template file not found: ' + templatePath + '. If this is your server, please create this file. ' + e
  }

  return template
}

instance.render = function (context) {
  context.componentTemplates = componentTemplates
  context.editPageLink = (context.editable) ? '<edit-page-link>{{contentPath}}</edit-page-link>'.replace(/{{contentPath}}/, context.contentPath) : ''

  var result = template(context)

  return result
}

module.exports = instance
