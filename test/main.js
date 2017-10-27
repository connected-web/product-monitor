const request = require('request')
const monitor = require('../lib/product-monitor')
const SUCCESS = 0
const FAILED = 1

const tick = '\u2713'
const cross = '\u2717'

start()

function start () {
  monitor({
    modulePath: '../monitoring',
    userContentPath: 'user-content'
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
