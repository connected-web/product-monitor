var creditr = require('octo-credits');

var params = {
  repo: 'johnbeech/product-monitor',
  accessToken: false
};

var instance = function() {};

function stitchRepoPathFrom(req) {
  var response = 'johnbeech/product-monitor'
  if(req.params.githubUser && req.params.githubRepo) {
    var githubUser = req.params.githubUser;
    var githubRepo = req.params.githubRepo;

    response = githubUser + "/" + githubRepo;
  }
  return response;
}

instance.configure = function(config) {
  params.accessToken = config.octoCredits.accessToken;
  return this;
}

instance.renderHtmlTable = function(req, res) {
  params.repo = stitchRepoPathFrom(req);
  var crediting = creditr(params);

  crediting.retreiveCredits(function(err, credits) {

    var creditsPage;

    if(err) {
      console.log(err);
      creditsPage = err;
    }
    else {
      creditsPage = crediting.format.table(credits);
    }

    res.send(creditsPage);
  });
}

instance.render = function (req, res) {
  params.repo = stitchRepoPathFrom(req);
  var crediting = creditr(params);

  var creditsPage = {};

  crediting.retreiveCredits(function(err, credits) {
    if(err) {
      console.log(err);
      credits = {
        error: err
      }
    }

    res.jsonp(credits);
  });
};

module.exports = instance;
