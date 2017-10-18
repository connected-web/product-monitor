var endpoint = {}

var server = false

endpoint.method = 'post'
endpoint.routes = ['/api/postMirror']
endpoint.cacheDuration = '1 second'
endpoint.description = 'Mirrors any information posted to this endpoint back as JSON.'

endpoint.configure = function (config) {

}

endpoint.render = function (req, res) {
  var mirror = {
    url: req.url,
    headers: req.headers,
    body: req.body,
    params: req.params
  }

  res.send(mirror)
}

module.exports = endpoint
