var secureMetaData = {
  rolesRequired: ['administrator']
};

function createDocumentationNavigation(routesModel) {
  var items = [];

  function createItem(href, linkText, divider, metaData) {
    var item = {};
    item.href = href;
    item.linkText = linkText;
    if (divider) {
      item.divider = divider;
    }
    item.metaData = metaData;
    return item;
  }

  items.push(createItem('/docs/api', 'API', true));
  items.push(createItem('/docs/create-your-own', 'Create your own'));
  items.push(createItem('/docs/component-showcase', 'Component Showcase'));
  items.push(createItem('/docs/custom-components-guide', 'Custom Components Guide'));
  items.push(createItem('/docs/custom-api-endpoint-guide', 'Custom API Endpoint Guide', true));
  items.push(createItem('/docs/express-routes', 'Express Routes Checker', true, secureMetaData));
  items.push(createItem('/docs/credits', 'Credits'));
  items.push(createItem('/docs/plugins', 'Plugins', false, secureMetaData));
  items.push(createItem('/docs/package-info', 'Package Info', false, secureMetaData));
  items.push(createItem('/docs/updates', 'Software Updates', false, secureMetaData));
  items.push(createItem('/docs/management', 'Management Console', false, secureMetaData));

  items.forEach(function (item) {
    routesModel.add('built-in', 'documentation', item.href, 'get', item.linkText, 0);
  });

  return items;
}

module.exports = createDocumentationNavigation;