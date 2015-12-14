var creditr = require('octo-credits');

var params = {
  repo: 'connected-web/product-monitor',
  accessToken: false
};

var instance = function() {};

instance.route = '/api/octoCredits/:githubUser/:githubRepo';
instance.description = 'Uses `octo-credits` to check the Github API for commits to a specific repository.';

instance.configure = function(config) {
  params.accessToken = config.octoCredits.accessToken;
  return this;
}

function stitchRepoPathFrom(req) {
  var repoPath = 'connected-web/product-monitor'
  if(req.params.githubUser && req.params.githubRepo) {
    var githubUser = req.params.githubUser;
    var githubRepo = req.params.githubRepo;

    repoPath = githubUser + '/' + githubRepo;
  }
  return repoPath;
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
      res.status(500);
    }
    res.jsonp(credits);
  });
};

module.exports = instance;
