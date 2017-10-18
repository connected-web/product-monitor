var endpoint = function () {}

var serverLog

endpoint.routes = ['/api/serverLog', '/api/serverLog/:lines', '/api/serverLog/:lines/:order']
endpoint.cacheDuration = '3 seconds'
endpoint.description = 'Returns the server log, based on capturing any `console.log` statements in memory since the server last restarted.'
endpoint.rolesRequired = ['administrator']

endpoint.configure = function (config) {
  serverLog = config.models.serverLog
}

endpoint.render = function (req, res) {
  var data = false

  var lineLimit = req.params.lines || 0
  var order = req.params.order || 'ascending'
  var log = serverLog.log

  if (lineLimit > 0) {
    log = log.slice(-lineLimit)
  }

  if (order == 'descending') {
    log.reverse()
  }

  data = {
    lineLimit: lineLimit,
    lines: log,
    timestamp: Date.now(),
    order: order
  }

  res.send(data)
}

module.exports = endpoint
