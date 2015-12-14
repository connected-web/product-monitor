var fs = require('fs');
var routesModel = require('../models/routes');

var instance = function () {}

var fileList = false;
var contentList = false;
var navigationItems = false;
var documentationItems = false;
var NL = '\n';

instance.route = '/api/navigation';

instance.configure = function (config) {
  var basePath = require('path').dirname(require.main.filename);
  instance.contentPath = config.userContentPath + '/content';
  instance.contentPathFull = basePath + '/' + instance.contentPath;
}

function readContentList(path) {
  var files = fs.readdirSync(path).filter(function (file) {
    return file.match(/.*content.html/) && !file.match(/index.content.html/);
  })

  return files;
}

function createContentItemsFromFileNames(files) {
  var contentList = files.map(function (file) {
    return file.split('.').slice(0, -2).join('.');
  });

  return contentList;
}

function createNavigationItemsFromContentItems(contentItems) {
  var navigationItems = contentItems.map(function (item) {
    var name = beautifyName(item);
    return {
      linkText: name,
      href: '/content/' + item
    };
  });

  var indexItem = {
    linkText: 'Index',
    href: '/',
    divider: true
  };

  navigationItems = [indexItem].concat(navigationItems);

  navigationItems.forEach(function (item) {
    routesModel.add('user', 'content', item.href, 'get', item.linkText, 0);
  });

  var routes = navigationItems.map(function (item) {
    return item.href;
  });
  console.log('[Navigation]', 'User content: ', NL + ' ', routes.join(NL + '  '), NL);

  return navigationItems;
}

function createDocumentationItems() {
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
  items.push(createItem('/docs/credits', 'Credits'));
  items.push(createItem('/docs/management', 'Management Console'));
  items.push(createItem('/docs/package-info', 'Package Info'));
  items.push(createItem('/docs/updates', 'Software Updates'));

  items.forEach(function (item) {
    routesModel.add('built-in', 'documentation', item.href, 'get', item.linkText, 0);
  });

  return items;
}

function beautifyName(fileName) {
  var cleanedName = fileName.replace(/[-_.]/g, ' ');
  var formattedName = toTitleCase(cleanedName);

  return formattedName;
}

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

instance.render = function (req, res) {
  if (fileList == false) {
    fileList = readContentList(instance.contentPathFull);
    contentList = createContentItemsFromFileNames(fileList);
    navigationItems = createNavigationItemsFromContentItems(contentList);
  }

  if (documentationItems == false) {
    documentationItems = createDocumentationItems();
  }

  var response = {
    contentPath: instance.contentPath,
    fileList: fileList,
    contentList: contentList,
    navigationItems: navigationItems,
    documentationItems: documentationItems
  }
  res.jsonp(response);
}

module.exports = instance;
