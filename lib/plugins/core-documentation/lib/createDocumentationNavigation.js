function createDocumentationNavigation(routesModel) {
  var items = [];

  function createItem(href, linkText, divider) {
    var item = {};
    item.href = href;
    item.linkText = linkText;
    if (divider) {
      item.divider = divider;
    }
    return item;
  }

  items.push(createItem('/docs/api', 'API', true));
  items.push(createItem('/docs/create-your-own', 'Create your own'));
  items.push(createItem('/docs/component-showcase', 'Component Showcase'));
  items.push(createItem('/docs/custom-components-guide', 'Custom Components Guide'));
  items.push(createItem('/docs/custom-api-endpoint-guide', 'Custom API Endpoint Guide', true));
  items.push(createItem('/docs/express-routes', 'Express Routes Checker', true));
  items.push(createItem('/docs/credits', 'Credits'));
  items.push(createItem('/docs/management', 'Management Console'));
  items.push(createItem('/docs/package-info', 'Package Info'));
  items.push(createItem('/docs/updates', 'Software Updates'));

  items.forEach(function (item) {
    routesModel.add('built-in', 'documentation', item.href, 'get', item.linkText, 0);
  });

  return items;
}

module.exports = createDocumentationNavigation;