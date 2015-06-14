var fs = require('fs');

var instance = function() {}

var configured = false;
var componentsPath = false;

// Configure common variables
instance.configure = function (config) {
  var basePath = require('path').dirname(require.main.filename);
  componentsPath = basePath + "/" + config.modulePath + "/component/templates";

  configured = true;

  return this;
}

function loadComponent(name) {
  return fs.readFileSync(componentsPath + "/" + name);
}

function loadComponents() {
  var components = [];
  var files = fs.readdirSync(componentsPath).filter(function(file) {
    return file.match(/.*component.html/);
  });

  components = files.map(function(file) {
    return loadComponent(file);
  });

  return components;
}

// Merge all the component files into one string
instance.mergeAll = function()
{
  if(!configured) {
    console.log("You must call .configure(config) with componentsPath set before calling mergeAll.");
    return;
  }

  var components = loadComponents();

  var NL = "\n";

  return components.join(NL + NL);
}

module.exports = instance;
