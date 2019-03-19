const fs = require('fs')
const path = require('path')
const cheerio = require('cheerio')
const NL = '\n'

const endpoint = {}

let routesModel
let documentationModel
let cachedAuthResponse
let cachedNoAuthResponse

endpoint.route = '/api/navigation'
endpoint.description = 'Provides navigation data to help users navigate around the site.'
endpoint.cacheDuration = '1 second'
endpoint.authMiddleware = skipCacheIfAuthenticated

endpoint.configure = function (config) {
  routesModel = config.models.routes || {}
  documentationModel = config.models.documentation || {}
  endpoint.contentPath = config.userContentPath + '/content'
  endpoint.contentPathFull = path.join(config.basePath, endpoint.contentPath)
}

function readContentList (path) {
  var files = fs.readdirSync(path).filter(function (file) {
    return file.match(/.*content.html/) && !file.match(/index.content.html/)
  })

  return files
}

function createContentItemsFromFiles (files) {
  var contentList = files.map(function (file) {
    var id = file.split('.').slice(0, -2).join('.')
    var metaData = extractMetaDataFromFile(file)
    var title = metaData.title || beautifyName(id)
    return {
      id,
      file,
      title,
      metaData
    }
  })

  return contentList
}

function extractMetaDataFromFile (file) {
  const filePath = path.join(endpoint.contentPathFull, file)
  try {
    var contents = fs.readFileSync(filePath, 'utf8')
    var $ = cheerio.load(contents)
  } catch (ex) {
    console.log('[Navigation] Find title from file', ex)
    return {}
  }
  var title = $('h1').text() || false
  var metaData = {
    title
  }
  $('meta').each(function (index, el) {
    const $el = $(this)
    metaData[$el.attr('name')] = $el.attr('content')
  })

  return metaData
}

function createNavigationItemsFromContentItems (contentItems) {
  var navigationItems = contentItems.map(function (item) {
    return {
      linkText: item.title,
      href: '/content/' + item.id,
      metaData: item.metaData
    }
  })

  var indexItem = {
    linkText: 'Index',
    href: '/',
    divider: true
  }

  navigationItems = [indexItem].concat(navigationItems)

  navigationItems.forEach(function (item) {
    routesModel.add('user', 'content', item.href, 'get', item.linkText, 0)
  })

  var routes = navigationItems.map(function (item) {
    return item.href
  })
  console.log('[Navigation]', 'User content: ', NL + ' ', routes.join(NL + '  '), NL)

  return navigationItems
}

function beautifyName (fileName) {
  var cleanedName = fileName.replace(/[-_.]/g, ' ')
  var formattedName = toTitleCase(cleanedName)

  return formattedName
}

function toTitleCase (str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
}

function skipCacheIfAuthenticated (req, res, next) {
  if (req.isAuthenticated() && req.user) {
    console.log('[Navigation] Authenticated', req.user.name)
    endpoint.render(req, res)
  } else {
    next()
  }
}

function stripAuthRequiredRoutes (object) {
  if (Array.isArray(object)) {
    return object
      .map((item) => stripAuthRequiredRoutes(item))
      .filter((item) => item)
  } else if (typeof object === 'object') {
    if (object.metaData && object.metaData.rolesRequired) {
      return
    }
    var result = {}
    Object.keys(object).forEach(function (key) {
      var value = object[key]
      result[key] = stripAuthRequiredRoutes(value)
    })
    return result
  } else {
    return object
  }
}

function createFullNavigationResponse () {
  var fileList = readContentList(endpoint.contentPathFull)
  var contentList = createContentItemsFromFiles(fileList)
  var navigationItems = createNavigationItemsFromContentItems(contentList)
  var documentationItems = documentationModel.items || []

  return {
    contentPath: endpoint.contentPath,
    navigationItems,
    documentationItems
  }
}

endpoint.render = function (req, res) {
  if (!cachedAuthResponse) {
    cachedAuthResponse = createFullNavigationResponse()
    cachedNoAuthResponse = stripAuthRequiredRoutes(cachedAuthResponse)
  }

  var response = (req.isAuthenticated() && req.user) ? cachedAuthResponse : cachedNoAuthResponse

  res.jsonp(response)
}

module.exports = endpoint
