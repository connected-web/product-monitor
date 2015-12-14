var serverDetails = require('../monitor/serverDetails');

var instance = {};

var server = false;

instance.method = 'post';
instance.routes = ['/api/restart/:serverHash'];
instance.cacheDuration = '1 second';
instance.description = 'Issues a command to trigger a restart of the server, provided that the serverHash matches.';

instance.configure = function (config) {

}

function validate(serverHash) {
  return (serverHash === serverDetails.serverHash);
}

instance.render = function (req, res) {
  var data = false;

  // Decide what to do
  var validKey = validate(req.params.serverHash);
  var message = (validKey) ? 'Restarting the server.' : 'Invalid server key.';
  data = {
    error: (!validKey),
    message: message
  };

  // Send the response
  res.send(data);

  // And then...
  if (validKey) {
    console.log('[Restart API] Going down for a restart in 2 seconds');
    setTimeout(function () {
      console.log('[Restart API] Attempting a restart...');
      var serverInstance = serverDetails.instance;
      serverInstance.restart();
    }, 2000);
  }
}

module.exports = instance;
