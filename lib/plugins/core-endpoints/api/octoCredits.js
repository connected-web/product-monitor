const creditr = require('octo-credits')

const params = {
  repo: 'connected-web/product-monitor',
  accessToken: false
}

const endpoint = function () {}

endpoint.route = '/api/octoCredits/:githubUser/:githubRepo'
endpoint.description = 'Uses `octo-credits` to check the Github API for commits to a specific repository.'

endpoint.configure = function (config) {
  params.accessToken = config.octoCredits.accessToken
  return this
}

function stitchRepoPathFrom (req) {
  var repoPath = 'connected-web/product-monitor'
  if (req.params.githubUser && req.params.githubRepo) {
    var githubUser = req.params.githubUser
    var githubRepo = req.params.githubRepo

    repoPath = githubUser + '/' + githubRepo
  }
  return repoPath
}

endpoint.render = function (req, res) {
  params.repo = stitchRepoPathFrom(req)
  var crediting = creditr(params)

  crediting.retreiveCredits(function (err, credits) {
    if (err) {
      console.log('Octocredits', err)
      credits = {
        error: err
      }
      res.status(500)
    }
    res.jsonp(credits)
  })
}

module.exports = endpoint
