const assert = require('assert')
const find = require('promise-path').find
const routesModel = require('../../monitor/models/routes')
const userHasAMatchingRole = require('../authentication/userHasAMatchingRole')
const NL = '\n'

// Configure common constiables
function configure (config) {
  const instance = {}
  const applicationConfig = config
  const server = config.server

  const basePath = require('path').dirname(require.main.filename)
  const userApiPath = basePath + '/' + config.userContentPath + '/api'

  let apicache = require('apicache').options(config.apiCache)
  config.apicacheInstance = apicache

  function readApiList (path) {
    return find(path + '/**/*.js')
      .catch((error) => console.log('[API Warning] Unable to read file list from [' + path + '] ' + error + NL))
  }

  function registerApiFiles (files, description, group) {
    const fileRoutes = files.map(function (file) {
      return registerApi(file, group)
    })
    const routes = [].concat.apply([], fileRoutes)

    console.log('[API Info] ' + description + ':', NL + ' ', routes.join(NL + '  '), NL)
  }

  function registerApi (file, group) {
    let routes
    try {
      const apiModule = require(file)

      // Validate the API interface by checking for required properties and functions
      validateApiRoute(apiModule, file)
      validateApiConfigure(apiModule, file)
      validateApiRender(apiModule, file)

      // Configure module using application config
      apiModule.configure(applicationConfig)

      // Set default duration on the module
      apiModule.cacheDuration = apiModule.cacheDuration || '1 hour'

      // Set default method verb from the module
      apiModule.method = apiModule.method || 'get'

      // Set default preRender method
      apiModule.preRender = apiModule.preRender || function (req) { /* Empty anonymous function */ }

      // Set default description
      apiModule.description = apiModule.description || ''

      // Check if auth is required for this endpoint
      apiModule.rolesRequired = apiModule.rolesRequired || []

      // Set appropriate middleware for handling authentication
      apiModule.authMiddleware = apiModule.authMiddleware || roleBasedAuth(apiModule.rolesRequired)

      // Register module as express server route
      routes = apiModule.routes.map(function (route) {
        try {
          registerRoute(route, apiModule)
          routesModel.add(group, 'api', route, apiModule.method, apiModule.description, apiModule.cacheTime)
          return route
        } catch (e) {
          console.log('[API Warning] Unable to register API route ' + route + ', error: ' + e + NL + e.stack)
        }
      })
    } catch (e) {
      console.log('[API Warning] Unable to register API, ' + file + ' error: ' + e + NL + e.stack)
    }
    return routes
  }

  function noAuth (req, res, next) {
    next()
  }

  function roleBasedAuth (requiredRoles) {
    // Solution for no roles
    if (!requiredRoles || requiredRoles.length === 0) {
      return noAuth
    }

    // Custom function when roles are required
    return function (req, res, next) {
      const user = req.user
      if (userHasAMatchingRole(user, requiredRoles)) {
        next()
      } else if (req.isAuthenticated() && req.user) {
        res.status(401)
        res.json({
          message: 'User does not have the correct role to access this service',
          error: true
        })
      } else {
        res.status(401)
        res.json({
          message: 'This endpoint requires authentication',
          error: true
        })
      }
    }
  }

  function registerRoute (route, apiModule) {
    server[apiModule.method.toLowerCase()](route, tryAuth(apiModule.authMiddleware), apicache.middleware(apiModule.cacheDuration), tryRender(apiModule.render))
  }

  function tryAuth (authMiddleware) {
    return function (req, res, next) {
      try {
        authMiddleware(req, res, next)
      } catch (exception) {
        const authError = {
          message: 'Caught an exception during API auth step',
          error: true,
          exception: exception + '',
          stack: exception.stack
        }
        console.log('[API Controller] Auth Error', authError)
        throw exception
      }
    }
  }

  function tryRender (render) {
    return function (req, res) {
      // Make the call
      try {
        render(req, res)
      } catch (exception) {
        const renderError = {
          message: 'Caught an exception during API render step',
          error: true,
          exception: exception + '',
          stack: exception.stack
        }
        console.log('[API Controller] Render Error', renderError)
        throw exception
      }
    }
  }

  function validateApiRoute (apiModule, file) {
    const advice = '.route property not defined as a String on API: ' + file + ", example: .route = '/api/my-route-name/:param';" + NL

    if (apiModule.route) {
      assert.ok(typeof apiModule.route === 'string', advice)
      apiModule.routes = [apiModule.route]
    } else if (apiModule.routes) {
      assert.ok(Array.isArray(apiModule.routes), advice)
    } else {
      assert.fail(advice)
    }
  }

  function validateApiConfigure (apiModule, file) {
    const advice = '.configure(config) function not defined on API: ' + file + ', example: ' + 'instance.config = function(config) {' + '  const server = config.server' + '}' + NL

    assert.ok(typeof apiModule.configure === 'function', advice)
  }

  function validateApiRender (apiModule, file) {
    const advice = '.render(req, res) function not defined on API: ' + file + ', example: ' + 'instance.render = function(req, res) {' + "  const data = {key: 'value'};" + '  res.send(data);' + '}' + NL

    assert.ok(typeof apiModule.render === 'function', advice)
  }

  // Register Plugin API endpoints
  instance.registerPluginAPIs = function (path) {
    return readApiList(path)
      .then((apiFiles) => registerApiFiles(apiFiles, 'Plugin routes', 'plugin'))
  }

  // Register User API endpoints
  instance.registerUserAPIs = function () {
    return readApiList(userApiPath)
      .then((apiFiles) => registerApiFiles(apiFiles, 'User routes', 'user'))
  }

  return instance
}

module.exports = {
  configure
}
