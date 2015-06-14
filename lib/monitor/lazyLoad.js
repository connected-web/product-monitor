var fs = require('fs');
var NL = "\n";

var instance = {};

function lazyLoad(file, defaultValue) {
  var result = defaultValue || false;

  var basePath = require('path').dirname(require.main.filename);
  var filePath = basePath + "/" + file;

  try {
    var options = {"encoding": "utf8"};
    result = fs.readFileSync(filePath, options);
  }
  catch(e) {
    console.log("[warning] Lazy load failed on: " + filePath + ", error: " + e + NL);
  }

  return result;
}

instance.text = function(file, defaultValue) {
  return lazyLoad(file, defaultValue);
}

instance.json = function(file, defaultValue) {
  var result = defaultValue || false;
  var contents = lazyLoad(file, defaultValue);

  try {
    result = JSON.parse(contents);
  }
  catch(e) {
    console.log("[warning] JSON parse failed on: " + file + ", error: " + e + NL);
  }

  return result;
}

module.exports = instance;
