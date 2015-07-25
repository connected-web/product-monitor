var commandRunner = require('../../monitor/commandRunner');

var instance = {};

instance.routes = ['/api/repo/status'];
instance.cacheDuration = '5 minutes';

instance.configure = function (config) {
  // Pre-cache information shortly after start-up
  setTimeout(checkRepo, 500);
}

var repo = {
  untrackedChanges: false,
  status: false,
  branch: false,
  remote: false,
  remoteUpdate: false,
  localHash: false,
  remoteHash: false,
  baseHash: false,
  commitStatus: false,
  needToPush: false,
  needToPull: false,
  diverged: false,
  upToDate: false
};

var computer = {
  enhance: function (data) {
    if (repo.localHash === repo.remoteHash) {
      repo.upToDate = true;
      repo.commitStatus = 'Local repo up-to-date with remote.';
    }
    else if(repo.localHash === repo.baseHash) {
      repo.needToPull = true;
      repo.commitStatus = 'Need to pull changes from remote.';
    }
    else if(repo.remoteHash === repo.baseHash) {
      repo.needToPush = true;
      repo.commitStatus = 'Need to push changes to remote.';
    }
    else {
      repo.diverged = true;
      repo.commitStatus = 'Local repo has diverged from remote.';
    }
  }
}


function checkRepo() {
  console.log('[API Repo Status] Runing git repo commands:')
  commandRunner.runCached('git status -s', gitStatusShort);
  commandRunner.runCached('git status -uno', gitStatus);
  commandRunner.runCached('git branch -v', gitBranch);
  commandRunner.runCached('git remote -v', gitRemote);
  commandRunner.runCached('git remote update', gitRemoteUpdate);

  // Check if pull needed, based on this brilliant answer:
  //  http://stackoverflow.com/questions/3258243/git-check-if-pull-needed
  commandRunner.runCached('git rev-parse @', gitRevParseAt);
  commandRunner.runCached('git rev-parse @{u}', gitRevParseAtU);
  commandRunner.runCached('git merge-base @ @{u}', gitRevParseAtAtU);
}

function gitStatusShort(result) {
  repo.untrackedChanges = (result.stdout) ? true : false;
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

function gitRemoteUpdate(result) {
  repo.remoteUpdate = (result.stdout || 'unknown').trim();
}

function gitRevParseAt(result) {
  repo.localHash = (result.stdout || 'unknown').trim();
}

function gitRevParseAtU(result) {
  repo.remoteHash = (result.stdout || 'unknown').trim();
}

function gitRevParseAtAtU(result) {
  repo.baseHash = (result.stdout || 'unknown').trim();
}

instance.render = function (req, res) {
  computer.enhance(repo);
  res.send(repo);
}

module.exports = instance;
