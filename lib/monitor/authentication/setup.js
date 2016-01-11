var passport = require('passport');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

function setup(app) {
  // Configure passport
  var secret = getServerHash(app);
  console.log('Secret', secret);

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