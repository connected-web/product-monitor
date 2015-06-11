module.exports = function(file, defaultValue) {
  var result = defaultValue || false;
  try {
    result = require(file);
  }
  catch(e) {
    console.log("Lazy load failed on: " + file);
  }
  return result;
}
