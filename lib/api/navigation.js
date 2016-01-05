var fs = require('fs');
var routesModel = require('../monitor/models/routes');
var cheerio = require('cheerio');

var endpoint = function () {}

var fileList = false;
var contentList = false;
var navigationItems = false;
var documentationItems = false;
var NL = '\n';

endpoint.route = '/api/navigation';
endpoint.description = 'Provides navigation data to help users navigate around the site.'

endpoint.configure = function (config) {
  endpoint.contentPath = config.userContentPath + '/content';
  endpoint.contentPathFull = config.basePath + '/' + endpoint.contentPath;
}

function readContentList(path) {
  var files = fs.readdirSync(path).filter(function (file) {
    return file.match(/.*content.html/) && !file.match(/index.content.html/);
  });

  return files;
}

function createContentItemsFromFiles(files) {
  var contentList = files.map(function (file) {
    var id = file.split('.').slice(0, -2).join('.');
    var title = findTitleFromFile(file) || beautifyName(id);
    return {
      id: id,
      file: file,
      title: title
    };
  });

  return contentList;
}

function findTitleFromFile(file) {
  var path = endpoint.contentPath + '/' + file;
  try {
    var contents = fs.readFileSync(path, 'utf8');
    var $ = cheerio.load(contents);
  } catch (ex) {
    console.log('Find title from file', ex);
    return false;
  }
  return $('h1').text();
}

function createNavigationItemsFromContentItems(contentItems) {
  var navigationItems = contentItems.map(function (item) {
    return {
      linkText: item.title,
      href: '/content/' + item.id
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

endpoint.render = function (req, res) {
  if (fileList == false) {
    fileList = readContentList(endpoint.contentPathFull);
    contentList = createContentItemsFromFiles(fileList);
    navigationItems = createNavigationItemsFromContentItems(contentList);
  }

  if (documentationItems == false) {
    documentationItems = createDocumentationItems();
  }

  var response = {
    contentPath: endpoint.contentPath,
    fileList: fileList,
    contentList: contentList,
    navigationItems: navigationItems,
    documentationItems: documentationItems
  }
  res.jsonp(response);
}

module.exports = endpoint;
