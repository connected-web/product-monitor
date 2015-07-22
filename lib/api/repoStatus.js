var commandRunner = require('../monitor/commandRunner');

var repo = {
    status: false,
    branch: false,
    remote: false
};

var instance = {};

instance.routes = ['/api/repoStatus'];
instance.cacheDuration = '5 minutes';

instance.configure = function (config) {
  // Pre-cache information shortly after start-up
  setTimeout(checkRepo, 500);
}

function checkRepo() {
    commandRunner.runCached('git status -uno', gitStatus);
    commandRunner.runCached('git branch -v', gitBranch);
    commandRunner.runCached('git remote -v', gitRemote);
}

function gitStatus(result) {
  repo.status = (result.stdout || 'unknown').trim();
}

function gitBranch(result) {
  repo.branch = (result.stdout || 'unknown').trim();
}

function gitRemote(result) {
  repo.remote = (result.stdout || 'unknown').trim();
}

instance.render = function(req, res) {
    res.send(repo);
}

module.exports = instance;
