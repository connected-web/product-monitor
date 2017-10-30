const endpoint = {}

let serverDetails
let sharedClientServerInstanceId

endpoint.route = '/api/monitorStatus'
endpoint.cacheDuration = '10 seconds'
endpoint.description = 'Reports the uptime of the server, and the unique serverHash generated when the endpoint started.'

endpoint.configure = function (config) {
  serverDetails = config.models.serverDetails
  sharedClientServerInstanceId = config.sharedClientServerInstanceId || false
}

endpoint.render = function (req, res) {
  const latestDetails = serverDetails.get()

  latestDetails.serverHash = sharedClientServerInstanceId || latestDetails.serverHash
  latestDetails.monitorHash = latestDetails.serverHash

  res.jsonp(latestDetails)
}

module.exports = endpoint
