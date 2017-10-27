// Require dependencies
const assert = require('assert')
const path = require('path')
const { ncp } = require('ncp')
ncp.limit = 16

// Load package.json from the module root
const packageJson = require(path.join(__dirname, '../../package.json'))

// Confirm that package.json has the expected properties
assert.ok(packageJson, 'Unable to find package.json')
assert.ok(typeof packageJson.files === 'object', 'No file list found on package.json')
assert.ok(typeof packageJson.dependencies === 'object', 'No dependencies found on package.json')

function copyTo (source, destination, path) {
  console.log('Copying path ' + path)

  ncp(source, destination, function (err) {
    if (err) {
      return console.error('[Install Local NPM for Example Monitor]', err)
    } else {
      console.log('Copied ' + path + ' done!')
    }
  })
}

// Copy files from module root, to example-monitor directory
const files = packageJson.files
files.map(function (filepath) {
  const source = filepath
  const destination = path.join(__dirname, '../example-monitor/node_modules/product-monitor/', filepath)
  copyTo(source, destination, filepath)
})

// Copy package dependencies from module root, to example-monitor directory
const dependencies = packageJson.dependencies
for (let filepath in dependencies) {
  var source = path.join('node_modules/', filepath)
  var destination = path.join(__dirname, '../example-monitor/node_modules/product-monitor/node_modules/', filepath)
  copyTo(source, destination, filepath)
}
