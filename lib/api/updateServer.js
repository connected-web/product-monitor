// Models
var serverDetails = require('../monitor/serverDetails');

// View
var handlebars = require('handlebars');
var templateNotOk = handlebars.compile('<p>{{message}}</p>');
var templateOk = handlebars.compile('<post-button post-url="/api/restart/{{restart-auth-code}}" result-target="{{result-target}}" id="{{result-target}}"><icon>ok</icon> {{message}}</post-button></p>');

// Controller
var instance = {};

var server = false;

instance.method = 'post';
instance.routes = ['/api/updateServer', '/api/updateServer/:serverHash'];
instance.cacheDuration = '1 second';

instance.configure = function (config) {

}

function validate(serverHash) {
  return (serverHash === serverDetails.serverHash);
}

instance.render = function (req, res) {
  var response = '';
  var validKey = validate(req.params.serverHash);

  // TODO: Require a valid key
  if(validKey || !validKey) {
    var now = Date.now();

    response = templateOk({
      "restart-auth-code": serverDetails.serverHash,
      "message": 'Restart the server',
      "result-target": 'restartButton' + now
    });
  }

  res.send(response);
}

module.exports = instance;
