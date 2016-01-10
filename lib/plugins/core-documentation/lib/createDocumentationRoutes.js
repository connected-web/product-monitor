var path = require('path');
var find = require('promise-path').find;
var NL = '\n';

function createDocumentationRoutes(app) {
  var config = app.config;

  // Create documentation routes
  var basePath = path.dirname(require.main.filename);
  var documentationPath = __dirname + '/../documentation';
  var documentationPattern = documentationPath + '/**/*.fragment.html';
  return find(documentationPattern)
    .then((files) => files.map(app.addContentPage))
    .then(function (routes) {
      console.log('[Navigation] Core Documentation:', NL + ' ', routes.join(NL + '  '), NL);
    })
    .catch(function (ex) {
      console.error('[Navigation] Unable to find documentation fragments', ex, ex.stack);
    });
}

module.exports = createDocumentationRoutes;