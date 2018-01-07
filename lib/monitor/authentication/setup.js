const path = require('path')
const passport = require('passport')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const expressSession = require('express-session')
const listRolesFor = require('./listRolesFor')

function setup (app) {
  let authenticationEnabled = false

  // Reference the express server
  const server = app.server

  // Add API methods
  app.enableAuthentication = enableAuthentication

  const authenticationModel = app.config.models.authentication = {
    supportedModes: {}
  }

  // Register passport
  registerPassportMiddleware()

  // Register content templates
  registerContentTemplates(app)

  function registerPassportMiddleware () {
    // Configure passport
    const secret = getServerHash(app)

    // Cookies
    server.use(cookieParser())

    // Form body parsing
    server.use(bodyParser.urlencoded({
      extended: true
    }))

    // Parse application/json from form data
    server.use(bodyParser.json())

    // Use sessions
    server.use(expressSession({
      secret,
      resave: false,
      saveUninitialized: false
    }))

    // Serialize user data
    passport.serializeUser(function (user, done) {
      done(null, user)
    })
    passport.deserializeUser(function (user, done) {
      done(null, user)
    })

    // Register passport
    server.use(passport.initialize())
    server.use(passport.session())
  }

  function registerMode (mode) {
    mode = mode || false

    // Register mode
    if (!mode) {
      throw new Error('No mode provided to enableAuthentication(); expected `mode.name` and `mode.url` to be set.')
    } else if (mode.name && mode.url) {
      authenticationModel.supportedModes[mode.name] = mode.url
    } else {
      throw new Error('Invalid mode provided to enableAuthentication(); expected `mode.name` and `mode.url` to be set; received ' + JSON.stringify(mode, null, '  '))
    }
  }

  function enableAuthentication (mode) {
    registerMode(mode)

    if (authenticationEnabled) {
      return
    }
    authenticationEnabled = true

    // Return this as a true fact
    server.get('/auth/enabled', function (req, res) {
      res.jsonp(true)
    })

    // Return user details, used for authentication purposes
    server.get('/auth/user', function (req, res) {
      const user = sanitize(req.user)
      const roles = listRolesFor(user)
      res.jsonp({
        user,
        roles
      })
    })

    // Return a combination of status and user details
    server.get('/auth/status', function (req, res) {
      const user = sanitize(req.user)
      const roles = listRolesFor(user)
      const supportedModes = authenticationModel.supportedModes
      res.jsonp({
        enabled: true,
        user,
        roles,
        supportedModes
      })
    })

    function broker (req, res) {
      const modes = authenticationModel.supportedModes
      const urls = Object.keys(modes).map((key) => modes[key])
      const brokeredUrl = (urls.length === 1) ? urls[0] : '/docs/login-options'
      console.log('[Auth] Brokering', req.path)
      const params = (req.query.redirect) ? '?redirect=' + req.query.redirect : ''
      res.redirect(brokeredUrl + params)
    }

    // Redirect to suitable login page
    server.get('/auth/login-broker', broker)
    server.get('/auth/login-broker/failiure', function (req, res, next) {
      next()
    }, broker)

    // Return supported modes
    server.get('/auth/login-options', function (req, res) {
      const options = authenticationModel.supportedModes
      res.jsonp({
        options
      })
    })

    // Route to logout
    server.get('/auth/logout', function (req, res) {
      req.logout()
      res.redirect('/docs/logout')
    })
  }

  return Promise.resolve()
}

function getServerHash (app) {
  try {
    return app.config.models.serverDetails.serverHash
  } catch (ex) {
    return Math.random() + ':'
  }
}

function registerContentTemplates (app) {
  app.addContentPage(path.join(__dirname, '/pages/login-options.fragment.html'))
  app.addContentPage(path.join(__dirname, '/pages/logout.fragment.html'))
  app.addContentPage(path.join(__dirname, '/pages/user-details.fragment.html'))
}

function sanitize (subject) {
  if (!subject) {
    return subject
  }

  const result = {}
  Object.keys(subject).forEach(function (key) {
    if (key.indexOf('password') !== -1) {
      return
    }
    const value = subject[key]
    if (typeof value === 'object') {
      result[key] = sanitize(value)
    }
    result[key] = subject[key]
  })
  return result
}

module.exports = setup
