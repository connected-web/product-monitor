/* Create a product monitor server with local content configuration */
const monitor = require('./lib/product-monitor')

monitor({
  serverPort: process.argv.slice(2)[0] || 8080,
  modulePath: 'monitoring',
  userContentPath: 'user-content',
  apiCache: {
    debug: false,
    enabled: true,
    defaultDuration: 300000 // in ms, 300 seconds, 5 minutes
  },
  productInformation: {
    title: 'Dev Monitor'
  },
  npmUpdate: {
    disableUpdates: false
  sharedClientServerInstanceId: 'abcdef0'
})
