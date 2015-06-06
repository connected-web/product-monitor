var fs = require('fs');

var instance = function() {}

var fileList = false;
var contentList = false;
var navigationItems = false;

function readContentList(path) {
  console.log("Generating navigation: ");
  var files = fs.readdirSync(path).filter(function(file) {
    console.log("Matched file: " + file);
    return file.match(/.*content.html/);
  })

  return files;
}

function createContentItemsFromFileNames(files) {
  var contentList = files.map(function(file) {
    return file.split(".").slice(0, -2).join(".");
  });

  return contentList;
}

function createNavigationItemsFromContentItems(contentItems) {
  var navigationItems = contentItems.map(function(item) {
    var name = beautifyName(item);
    return {
      linkText: name,
      href: "/" + item
    };
  });

  return navigationItems;
}

function beautifyName(fileName) {
  var cleanedName = fileName.replace(/[-_.]/g, " ");
  var formattedName = toTitleCase(cleanedName);

  return formattedName;
}
function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

instance.configure = function(config) {
  var basePath = require('path').dirname(require.main.filename);
  instance.contentPath = config.contentPath;
  instance.contentPathFull = basePath + "/" + instance.contentPath;
}

instance.render = function(req, res) {
  if(fileList == false) {
    fileList = readContentList(instance.contentPathFull);
    contentList = createContentItemsFromFileNames(fileList);
    navigationItems = createNavigationItemsFromContentItems(contentList);
  }

  var response = {
    contentPath: instance.contentPath,
    fileList: fileList,
    contentList: contentList,
    navigationItems: navigationItems
  }
  res.jsonp(response);
}

module.exports = instance;
