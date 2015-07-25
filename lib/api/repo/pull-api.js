var commandRunner = require('../../monitor/commandRunner');
var serverDetails = require('../../monitor/serverDetails');

var instance = {};

instance.routes = ['/api/repo/pull/status'];
instance.cacheDuration = 1;

var pullStartTime = 0;
var pullEndTime = 0;
var pulling = false;
var pulled = false;
var pullResult = false;
var messagePlan = '';

instance.confirmationHash = '929cf549c9f86c4355fcad1cce61ad6c';

instance.beginPullAction = function () {
  console.log('[Repo Pull Status] Begin pull action');
  pulling = true;
  pullStartTime = Date.now();
  pullResult = false;
  commandRunner.runCached('git pull', gitPull);
}

function gitPull(result) {
  pullEndTime = Date.now();
  pulling = false;
  pulled = true;
  pullResult = (result.stdout + '').trim();

  var restartRequired = (pullResult === 'Already up-to-date.') ? false : true;
  messagePlan = (restartRequired) ? 'Restarting the server shortly' : 'No further action required.';
  console.log('[Repo Pull API]', messagePlan);

  if (restartRequired) {
    commandRunner.runCached('npm install', npmInstall);
  }
  else {
    setTimeout(resetPullAction, 10000, messagePlan);
  }
}

function npmInstall(result) {
  console.log('[Repo Pull API] npm install result:', result);
  console.log('[Repo Pull API] Going down for a restart in 2 seconds');
  setTimeout(function () {
    console.log('[Repo Pull API] Attempting a restart...');
    var serverInstance = serverDetails.instance;
    serverInstance.restart();
  }, 2000);
}

instance.configure = function (config) {
  resetPullAction('Start up');
}

instance.render = function (req, res) {
  var data = {};

  var pullTimeInSeconds = (pullStartTime) ? Math.ceil((Date.now() - pullStartTime) / 1000) : 0;
  if (pullTimeInSeconds > 60) {
    // Probably something went wrong
    resetPullAction('Took longer then 60 seconds');
  }

  var pullLengthInSeconds = (pullEndTime && pullStartTime) ? Math.ceil((pullEndTime - pullStartTime) / 1000) : 0;

  var htmlResponse = '';
  var notStarted = !pulling;

  if (pulled) {
    htmlResponse = '<div class="btn btn-success disabled"><icon>cog</icon> <span>Finished pulling from repo, took :time seconds. :messagePlan</span></div>'
      .replace(':time', pullLengthInSeconds)
      .replace(':messagePlan', messagePlan);
    htmlResponse += '<p><pre class="alert alert-info">:pullResult</pre></p>'.replace(':pullResult', pullResult);
  } else if (notStarted) {
    htmlResponse = '<post-button post-url="/api/repo/pull/confirm/:confirmationHash" result-target="pull-from-repo"><icon>save</icon> <span>Pull Repo Changes</span></post-button>'.replace(':confirmationHash', instance.confirmationHash);
  } else if (pulling) {
    var statusClass = setStatusClassBasedOn(pullTimeInSeconds);
    htmlResponse = '<div class="btn btn-:statusClass disabled"><icon>cog</icon> <span>Pulling from repo... :timeInSeconds seconds</span></div>'
      .replace(':timeInSeconds', pullTimeInSeconds)
      .replace(':statusClass', statusClass);
  } else {
    htmlResponse = '<pre class="btn btn-warning">/api/repo/pull/status in unknown/default state.</pre>';
  }

  res.send(htmlResponse);
}

function resetPullAction(reason) {
  console.log('[Repo Pull Status] Resetting pull action: ', reason)
  pullStartTime = 0;
  pullEndTime = 0;
  pulling = false;
  pulled = false;
  messagePlan = 'No plan';
}

function setStatusClassBasedOn(time) {
  var result = 'default';
  if (time > 60) {
    result = 'danger';
  } else if (time > 30) {
    result = 'warning';
  } else if (time > 10) {
    result = 'info'
  } else {
    result = 'primary';
  }
  return result;
}

module.exports = instance;
