var instance = {};

var server = false;

instance.method = 'post';
instance.routes = ['/api/postMirror'];
instance.cacheDuration = '1 second';
instance.description = 'Mirrors any information posted to this endpoint back as JSON.';

instance.configure = function (config) {

}

instance.render = function (req, res) {
  var mirror = {
    url: req.url,
    headers: req.headers,
    body: req.body,
    params: req.params
  };

  res.send(mirror);
}

module.exports = instance;
