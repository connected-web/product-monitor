var colors = require('colors')
var request = require('request')
var monitor = require('../lib/product-monitor')
var SUCCESS = 0,
  FAILED = 1

var tick = '\u2713'
var cross = '\u2717'

start()

function start () {
  monitor({
    'modulePath': '../monitoring',
    'userContentPath': 'user-content'
  }, thenListen)
}

function thenListen (instance) {
  instance.listen(thenComprehend)
}

function thenComprehend (error) {
  if (error) {
    console.log('Could not start server to run smoke test.')
    process.exit(1)
  } else {
    runTest()
  }
}

function runTest () {
  console.log('Running smoke test on server:')
  request('http://localhost:9000/api/monitorStatus', thenConfirmTestResult)
}

function thenConfirmTestResult (error, response, body) {
  if (!error && response.statusCode === 200) {
    console.log(` ${tick} Passed basic URL Test`.green)
    finish(SUCCESS)
  } else {
    console.log(` ${cross} Failed basic URL Test`.red)
  }
  finish(FAILED)
}

function finish (code) {
  setTimeout(function () {
    process.exit(code)
  }, 0)
}
