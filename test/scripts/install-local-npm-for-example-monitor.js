// Require dependencies
var assert = require('assert')
var ncp = require('ncp').ncp
ncp.limit = 16

// Load package.json from the module root
var packageJson = require(__dirname + '/../../package.json')

// Confirm that package.json has the expected properties
assert.ok(packageJson, 'Unable to find package.json')
assert.ok(typeof packageJson.files === 'object', 'No file list found on package.json')
assert.ok(typeof packageJson.dependencies === 'object', 'No dependencies found on package.json')

function copyTo (source, destination, path) {
  console.log('Copying path ' + path)

  ncp(source, destination, function (err) {
    if (err) {
      return console.error(err)
    } else {
      console.log('Copied ' + path + ' done!')
    }
  })
}

// Copy files from module root, to example-monitor directory
var files = packageJson.files
files.map(function (path) {
  var source = path
  var destination = __dirname + '/../example-monitor/node_modules/product-monitor/' + path
  copyTo(source, destination, path)
})

// Copy package dependencies from module root, to example-monitor directory
var dependencies = packageJson.dependencies
for (path in dependencies) {
  var source = 'node_modules/' + path
  var destination = __dirname + '/../example-monitor/node_modules/product-monitor/node_modules/' + path
  copyTo(source, destination, path)
};
