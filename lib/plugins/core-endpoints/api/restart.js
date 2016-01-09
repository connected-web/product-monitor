var endpoint = {};

var serverDetails;

endpoint.method = 'post';
endpoint.routes = ['/api/restart/:serverHash'];
endpoint.cacheDuration = '1 second';
endpoint.description = 'Issues a command to trigger a restart of the server, provided that the serverHash matches.';

endpoint.configure = function (config) {
  serverDetails = config.models.serverDetails;
}

function validate(serverHash) {
  return (serverHash === serverDetails.serverHash);
}

endpoint.render = function (req, res) {
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
      serverDetails.instance.restart();
    }, 2000);
  }
}

module.exports = endpoint;