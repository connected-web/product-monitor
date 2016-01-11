var passport = require('passport');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

function setup(app) {
  var authenticationEnabled = false;

  // Add API method
  app.enableAuthentication = enableAuthentication;

  var authenticationModel = app.config.models.authentication = {
    supportedModes: {}
  };

  // Register passport
  registerPassportMiddleware();

  function registerPassportMiddleware() {
    // Configure passport
    var secret = getServerHash(app);

    // Cookies
    server.use(cookieParser());

    // Form body parsing
    server.use(bodyParser.urlencoded({
      extended: true
    }));

    // Parse application/json from form data
    server.use(bodyParser.json());

    // Use sessions
    server.use(expressSession({
      secret,
      resave: false,
        saveUninitialized: false
    }));

    // Serialize user data
    passport.serializeUser(function (user, done) {
      done(null, user);
    });
    passport.deserializeUser(function (user, done) {
      done(null, user);
    });

    // Register passport
    server.use(passport.initialize());
    server.use(passport.session());
  }

  function enableAuthentication(mode) {
    mode = mode || false;
    if (authenticationEnabled) {
      return;
    }
    authenticationEnabled = true;

    // Register mode
    if (!mode) {
      throw 'No mode provided to enableAuthentication(); expected `mode.name` and `mode.url` to be set.';
    } else if (mode.name && mode.url) {
      authenticationModel.supportedModes[mode.name] = mode.url;
    } else {
      throw 'Invalid mode provided to enableAuthentication(); expected `mode.name` and `mode.url` to be set; received ' + JSON.stringify(mode, null, '  ');
    }

    // Return this as a true fact
    server.get('/auth/enabled', function (req, res) {
      res.jsonp(true);
    });

    // Return user details
    server.get('/auth/user', function (req, res) {
      res.jsonp({
        user: req.user
      });
    });

    // Return a combination of status and user details
    server.get('/auth/status', function (req, res) {
      res.jsonp({
        enabled: true,
        user: req.user,
        supportedModes: authenticationModel.supportedModes
      });
    });

    // Route to logout
    server.get('/auth/logout', function (req, res) {
      req.logout();
      res.redirect('/docs/logout');
    });
  }

  return Promise.accept();
}

function getServerHash(app) {
  try {
    return app.config.models.serverDetails.serverHash;
  } catch (ex) {
    return Math.random() + ':';
  }
}

module.exports = setup;