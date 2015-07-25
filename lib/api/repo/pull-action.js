var pullStatus = require('./pull-api');

var commandRunner = require('../../monitor/commandRunner');

var instance = {};

instance.method = 'post';
instance.routes = ['/api/repo/pull/confirm/:confirmationHash'];
instance.cacheDuration = '1 second';


instance.configure = function (config) {

}

instance.render = function (req, res) {
  var data = {};

  if(req.params.confirmationHash === pullStatus.confirmationHash) {
    pullStatus.beginPullAction();
    res.send('<get-html data-source-url="/api/repo/pull/status" refresh-time="3"><div class="btn btn-success disabled"><icon>cog</icon> One moment...</div></get-html>');
  }
  else {
    res.status(403).json({
      error: true,
      message: 'Route not recognised.',
      route: req.route.path
    });
  }
}

module.exports = instance;
