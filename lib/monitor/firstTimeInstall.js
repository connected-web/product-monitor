const fs = require('fs')
const { ncp } = require('ncp')
const NL = '\n'

const instance = {}

let userContentPath = false
let moduleContentPath = false

instance.configure = function (config) {
  userContentPath = config.basePath + '/' + config.userContentPath
  moduleContentPath = config.basePath + '/' + config.modulePath
}

function checkForUserDirectory () {
  ensureExists(userContentPath, 744, function (error) {
    if (error) {
      console.log('[Startup Check] Created user content directory: ' + userContentPath + NL)
      stepFinished('checkForUserDirectory')
    } else {
      // console.log('[Startup Check] User content directory seems to exist: ' + userContentPath + NL);
      skipStep('checkForUserDirectory')
    }
  })
}

function checkForContentDirectory () {
  var folder = '/content'
  ensureExists(userContentPath + folder, 744, function (error) {
    if (error) {
      // handle folder creation error
      console.log('[Startup Info] Creating user content directory at ' + userContentPath + folder + NL)
      copyTo(moduleContentPath + folder, userContentPath + folder, folder, 'checkForContentDirectory')
    } else {
      // console.log('[Startup Check] Content directory seems to exist: ' + userContentPath + folder + NL);
      skipStep('checkForContentDirectory')
    }
  })
}

function checkForApiDirectory () {
  var folder = '/api'
  ensureExists(userContentPath + folder, 744, function (error) {
    if (error) {
      // handle folder creation error
      console.log('[Startup Info] Creating user API directory at: ' + userContentPath + folder + NL)
      copyTo(moduleContentPath + folder, userContentPath + folder, folder, 'checkForApiDirectory')
    } else {
      // console.log('[Startup Check] API directory seems to exist: ' + userContentPath + folder + NL);
      skipStep('checkForApiDirectory')
    }
  })
}

function checkForImagesDirectory () {
  var folder = '/images'
  ensureExists(userContentPath + folder, 744, function (error) {
    if (error) {
      // handle folder creation error
      console.log('[Startup Info] Creating user images directory at: ' + userContentPath + folder + NL)
      copyTo(moduleContentPath + folder, userContentPath + folder, folder, 'checkForImagesDirectory')
    } else {
      // console.log('[Startup Check] Images directory seems to exist: ' + userContentPath + folder + NL);
      skipStep('checkForImagesDirectory')
    }
  })
}

function checkForTemplatesDirectory () {
  var folder = '/templates'
  ensureExists(userContentPath + folder, 744, function (error) {
    if (error) {
      // handle folder creation error
      console.log('[Startup Info] Creating templates directory at: ' + userContentPath + folder + NL)
      copyTo(moduleContentPath + folder, userContentPath + folder, folder, 'checkForTemplatesDirectory')
    } else {
      // console.log('[Startup Check] Templates directory seems to exist: ' + userContentPath + folder + NL);
      skipStep('checkForTemplatesDirectory')
    }
  })
}

function checkForPluginsDirectory () {
  var folder = '/plugins'
  ensureExists(userContentPath + folder, 744, function (error) {
    if (error) {
      // handle folder creation error
      console.log('[Startup Info] Creating plugins directory at: ' + userContentPath + folder + NL)
      copyTo(moduleContentPath + folder, userContentPath + folder, folder, 'checkForPluginsDirectory')
    } else {
      // console.log('[Startup Check] Plugins directory seems to exist: ' + userContentPath + folder + NL);
      skipStep('checkForPluginsDirectory')
    }
  })
}

function ensureExists (path, mask, cb) {
  if (typeof mask === 'function') { // allow the `mask` parameter to be optional
    cb = mask
    mask = 777
  }
  try {
    fs.mkdirSync(path, mask)
    cb()
  } catch (error) {
    if (error && error.code === 'EEXIST') {
      cb() // ignore the error if the folder already exists
    } else {
      cb(error) // something else went wrong
    }
  }
}

function copyTo (source, destination, path, step) {
  console.log('Copying path ' + path + NL)

  ncp(source, destination, function (err) {
    if (err) {
      return console.error('[First Time Install]', err)
    } else {
      console.log('Copied ' + path + ' done!' + NL)
      stepFinished(step)
    }
  })
}

var onReadyCallback = false
var completedSteps = {
  checkForUserDirectory: false,
  checkForContentDirectory: false,
  checkForApiDirectory: false,
  checkForImagesDirectory: false,
  checkForTemplatesDirectory: false,
  checkForPluginsDirectory: false
}

function stepFinished (step) {
  console.log('[Startup Step Finished] ' + step + NL)
  completedSteps[step] = true
  checkForCompletion()
}

function skipStep (step) {
  completedSteps[step] = true
  checkForCompletion()
}

function checkForCompletion () {
  for (let key in completedSteps) {
    if (completedSteps[key] === false) {
      return
    }
  }

  console.log('[Startup Checks Complete] ' + NL)
  onReadyCallback.call()
}

instance.runChecks = function (callback) {
  onReadyCallback = callback
  if (typeof onReadyCallback !== 'function') {
    throw new Error('Cannot run checks without a callback, this method needs to be synchronous, but makes asynchronous calls to the file system.')
  }

  checkForUserDirectory()
  checkForContentDirectory()
  checkForApiDirectory()
  checkForImagesDirectory()
  checkForTemplatesDirectory()
  checkForPluginsDirectory()
}

module.exports = instance
