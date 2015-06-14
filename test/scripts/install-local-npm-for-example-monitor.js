// Require dependencies
var assert = require('assert');
var ncp = require('ncp').ncp;
ncp.limit = 16;
var lazyLoad = require('../../lib/monitor/lazyLoad');

// Load package.json from the module root
var moduleRoot = '../../';
var packageJson = lazyLoad.json(moduleRoot + 'package.json', false);

// Confirm that package.json has the expected properties
assert.ok(packageJson, "Unable to find package.json");
assert.ok(typeof packageJson.files === 'object', "No file list found on package.json");

// Copy files from module root, to example-monitor directory
var files = packageJson.files;
files.map(function(path) {
  var source = path;
  var destination = __dirname + '/../example-monitor/node_modules/product-monitor/' + path;
  console.log("Copying path " + source + " to " + destination);
  ncp(source, destination, function (err) {
   if (err) {
     return console.error(err);
   }
   console.log('done!');
  });
});
