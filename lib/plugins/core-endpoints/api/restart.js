const endpoint = {}

let serverDetails
let sharedClientServerInstanceId

endpoint.method = 'post'
endpoint.routes = ['/api/restart/:serverHash']
endpoint.cacheDuration = '1 second'
endpoint.description = 'Issues a command to trigger a restart of the server, provided that the serverHash matches.'
endpoint.rolesRequired = ['administrator', 'named']

endpoint.configure = function (config) {
  serverDetails = config.models.serverDetails
  sharedClientServerInstanceId = config.sharedClientServerInstanceId || false
}

function validate (serverHash) {
  return (serverHash === serverDetails.serverHash || serverHash === sharedClientServerInstanceId)
}

endpoint.render = function (req, res) {
  // Decide what to do
  const validKey = validate(req.params.serverHash)
  const message = (validKey) ? 'Restarting the server.' : 'Invalid server key.'
  const data = {
    error: (!validKey),
    message: message
  }

  // Send the response
  res.send(data)

  // And then...
  if (validKey) {
    console.log('[Restart API] Going down for a restart in 2 seconds')
    setTimeout(function () {
      console.log('[Restart API] Attempting a restart...')
      serverDetails.instance.restart()
    }, 2000)
  }
}

module.exports = endpoint
