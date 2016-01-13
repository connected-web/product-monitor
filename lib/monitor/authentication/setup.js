var passport = require('passport');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

function setup(app) {
  var authenticationEnabled = false;

  // Add API method
  app.enableAuthentication = enableAuthentication;

  console.log('I turned up here');
  var authenticationModel = app.config.models.authentication = {
    supportedModes: {}
  };

  // Register passport
  registerPassportMiddleware();

  // Register content templates
  registerContentTemplates(app);

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

  function registerMode(mode) {
    mode = mode || false;

    // Register mode
    if (!mode) {
      throw 'No mode provided to enableAuthentication(); expected `mode.name` and `mode.url` to be set.';
    } else if (mode.name && mode.url) {
      authenticationModel.supportedModes[mode.name] = mode.url;
    } else {
      throw 'Invalid mode provided to enableAuthentication(); expected `mode.name` and `mode.url` to be set; received ' + JSON.stringify(mode, null, '  ');
    }
  }

  function enableAuthentication(mode) {
    registerMode(mode);

    if (authenticationEnabled) {
      return;
    }
    authenticationEnabled = true;

    // Return this as a true fact
    server.get('/auth/enabled', function (req, res) {
      res.jsonp(true);
    });

    // Return user details
    server.get('/auth/user', function (req, res) {
      var user = sanitize(req.user);
      res.jsonp({
        user
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

    function broker(req, res) {
      var modes = authenticationModel.supportedModes;
      var urls = Object.keys(modes).map((key) => modes[key]);
      var brokeredUrl = (urls.length === 1) ? urls[0] : '/docs/login-options';
      res.redirect(brokeredUrl);
    }

    // Redirect to suitable login page
    server.get('/auth/login-broker', broker);
    server.get('/auth/login-broker/failiure', function (req, res, next) {
      next();
    }, broker);

    // Return supported modes
    server.get('/auth/login-options', function (req, res) {
      var options = authenticationModel.supportedModes;
      res.jsonp({
        options
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

function registerContentTemplates(app) {
  app.addContentPage(__dirname + '/pages/login-options.fragment.html');
  app.addContentPage(__dirname + '/pages/logout.fragment.html');
}

function sanitize(subject) {
  var result = {};
  Object.keys(subject).forEach(function (key) {
    if (key === 'password') {
      return;
    }
    var value = subject[key];
    if ('object' === typeof value) {
      result[key] = sanitize(value);
    }
    result[key] = subject[key];
  });
  return result;
}

module.exports = setup;