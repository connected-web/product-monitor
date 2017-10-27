const path = require('path')
const find = require('promise-path').find
const NL = '\n'

function createDocumentationRoutes (app) {
  // Create documentation routes
  const documentationPath = path.join(__dirname, '../documentation')
  const documentationPattern = path.join(documentationPath, '**/*.fragment.html')
  return find(documentationPattern)
    .then((files) => files.map(app.addContentPage))
    .then(function (routes) {
      console.log('[Navigation] Core Documentation:', NL + ' ', routes.join(NL + '  '), NL)
    })
    .catch(function (ex) {
      console.error('[Navigation] Unable to find documentation fragments', ex, ex.stack)
    })
}

module.exports = createDocumentationRoutes
