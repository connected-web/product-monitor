// Models
const commandRunner = require('../lib/commandRunner')

const resultCache = {}

let updatesDisabled = false
let updating = false

// View
const handlebars = require('handlebars')
const templateConfirm = handlebars.compile('<post-button post-url="/api/updateServer/auth/{{restart-auth-code}}" result-target="{{result-target}}" id="{{result-target}}"><icon>ok</icon> {{message}}</post-button>')
const templateUpdating = handlebars.compile('<button class="btn btn-info disabled"><icon>cog</icon> {{message}}</button>')

// Controller
const endpoint = {}

let serverDetails

endpoint.method = 'post'
endpoint.routes = ['/api/updateServer', '/api/updateServer/:serverHash', '/api/updateServer/auth/:authCode']
endpoint.cacheDuration = '1 second'
endpoint.description = 'Attempts to update the server packages by running `npm update --save`'
endpoint.rolesRequired = ['administrator']

endpoint.configure = function (config) {
  updatesDisabled = config.npmUpdate.disableUpdates
  serverDetails = config.models.serverDetails
}

function doUpdate () {
  var command = 'npm update --save'
  updating = true

  function dealWithResult (result) {
    var data = false
    var message = false
    if (result.error || result.stderr) {
      message = 'Exec error: ' + command + ', ' + result.error + ', ' + result.stderr
    } else {
      if (result.stdout) {
        data = result.stdout
        message = 'Update complete!'
        console.log('[npm Update API]', message, command, process.cwd(), result.error, result.stderr, result.stdout)

        // Prompt a restart!
        setTimeout(beginRestart, 0)
      } else {
        data = {}
      }
    }

    console.log('[Update Server]', message, process.cwd())

    result = {
      data: data,
      message: message,
      error: result.error,
      cacheDuration: endpoint.cacheDuration
    }

    // Update the local result cache
    resultCache[command] = templateUpdating({
      message: 'Update Complete, Restarting...'
    })
  }

  // Trigger the command, if not already running
  commandRunner.run(command, dealWithResult)
}

function beginRestart () {
  console.log('Going down for a restart in 2 seconds')
  setTimeout(function () {
    console.log('Attempting a restart...')
    updating = false
    serverDetails.instance.restart()
  }, 2000)
}

function validate (authCode) {
  return (authCode === serverDetails.serverHash)
}

endpoint.render = function (req, res) {
  var response = ''
  if (updating) {
    response = templateUpdating({
      message: 'Updating'
    })
  } else if (updatesDisabled) {
    response = templateUpdating({
      message: 'Updates disabled by Server Config'
    })
  } else {
    var validKey = validate(req.params.authCode)

    if (validKey) {
      doUpdate()
      response = templateUpdating({
        message: 'Update started'
      })
    } else {
      var now = Date.now()
      response = templateConfirm({
        'restart-auth-code': serverDetails.serverHash,
        'message': 'Confirm Update',
        'result-target': 'confirmButton_' + now
      })
    }
  }

  res.send(response)
}

module.exports = endpoint
