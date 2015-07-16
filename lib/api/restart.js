var serverDetails = require('../monitor/serverDetails');

var instance = {};

var server = false;

instance.method = "post";
instance.routes = ["/api/restart/:serverHash"];
instance.cacheDuration = "1 second";

instance.configure = function (config) {

}

function validate(serverHash) {
  return (serverHash === serverDetails.serverHash);
}

instance.render = function (req, res) {
  var data = false;

  var validKey = validate(req.params.serverHash);
  var message = (validKey) ? 'Valid server key.' : 'Invalid server key.';

  data = {
    message: message
  };

  res.send(data);
}

module.exports = instance;
