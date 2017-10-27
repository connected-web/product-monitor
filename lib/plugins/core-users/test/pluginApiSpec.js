/* eslint-env mocha */
const { expect } = require('chai')
const plugin = require('../lib/plugin')

describe('Plugin API', function () {
  var instance

  beforeEach(function () {
    instance = plugin()
  })

  it('should provide info about the plugin', function () {
    var actual = instance.info()
    expect(actual).to.have.property('name')
    expect(actual).to.have.property('description')
    expect(actual).to.have.property('keywords')
  })

  it('should apply methods to the supplied application', function (done) {
    var keys = [
      'findUsersBy',
      'listUsers',
      'addUsers',
      'removeUsersBy',
      'updateUsersBy'
    ]

    var app = {

    }

    instance.apply(app).then(function (done) {
      keys.forEach(function (key) {
        expect(app.users).to.have.property(key)
        expect(typeof app.users[key]).to.equal('function')
      })
    })
      .then(done)
      .catch(done)
  })

  it('should provide a default config', function () {
    var actual = instance.getConfig()
    expect(actual).to.have.property('storagePath')
  })

  it('should allow the default config to be changed', function () {
    var expected = {
      storagePath: 'some storage path'
    }
    expect(instance.getConfig()).to.not.deep.equal(expected)

    instance.setConfig(expected)
    expect(instance.getConfig()).to.deep.equal(expected)
  })
})
