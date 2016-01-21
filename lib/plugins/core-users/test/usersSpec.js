var expect = require('chai').expect;
var users = require('../lib/users');
var clean = require('promise-path').clean;
var read = require('promise-path').read;

describe('Users API', function () {

  var api = {};
  var dbPath = require('path').dirname(require.main.filename) + '/users-temp';

  function createApi() {
    return users(dbPath)
      .then(function (result) {
        api = result;
      });
  }

  function readDbFile() {
    return read(dbPath + '/users-db.json')
      .then(JSON.parse);
  }

  function resetApi(done) {
    clean(dbPath)
      .then(createApi)
      .then(done)
      .catch(done);
  }

  describe('Create', function () {

    beforeEach(resetApi);

    it('should return an promise, that eventually returns the API', function () {
      expect(typeof users).to.equal('function');
      expect(typeof api).to.equal('object');
    });

    it('should initialise an empty users database', function (done) {
      read(dbPath + '/users-db.json')
        .then(JSON.parse)
        .then(function (actual) {
          expect(actual).to.deep.equal({
            list: []
          });
        })
        .then(done)
        .catch(done);
    });
  });

  describe('Expected methods', function () {
    var keys = [
      'findUsersBy',
      'listUsers',
      'addUsers',
      'removeUsersBy',
      'updateUsersBy'
    ];

    keys.forEach(function (key) {
      it(`should expose ${key}`, function () {
        expect(api).to.have.property(key);
        expect(typeof api[key]).to.equal('function');
      });
    });
  });

  describe('Add users', function () {

    beforeEach(resetApi);

    var expected = ['anna', 'elsa', 'poppy', 'dawn'];

    it('should be able to add a list of users', function (done) {
      api.addUsers(expected)
        .then(function (actual) {
          expect(actual).to.deep.equal(expected);
        })
        .then(done)
        .catch(done);
    });

    it('should save added users to the db file', function (done) {
      api.addUsers(expected)
        .then(readDbFile)
        .then(function (actual) {
          expect(actual.list).to.deep.equal(expected);
        })
        .then(done)
        .catch(done);
    });
  });

  describe('Remove users', function () {
    var entries = [{
      'id': 'elsa',
      'registered': false
    }, {
      'id': 'anna',
      'registered': false
    }, {
      'id': 'poppy',
      'registered': true
    }, {
      'id': 'dawn',
      'registered': true
    }];

    beforeEach(resetApi);

    it('should be able to remove added users by field', function (done) {
      api.addUsers(entries)
        .then(function () {
          return api.removeUsersBy('registered', false);
        })
        .then(function (actual) {
          var removedEntries = [entries[0], entries[1]];
          expect(actual).to.deep.equal(removedEntries);
        })
        .then(done)
        .catch(done);
    });

    it('should save removed users from the db file', function (done) {
      api.addUsers(entries)
        .then(function () {
          return api.removeUsersBy('registered', false);
        })
        .then(readDbFile)
        .then(function (actual) {
          var remainingEntries = [entries[2], entries[3]];
          expect(actual.list).to.deep.equal(remainingEntries);
        })
        .then(done)
        .catch(done);
    });
  });

  describe('List users', function () {

    beforeEach(resetApi);

    it('should list empty users', function (done) {
      api.listUsers()
        .then(function (actual) {
          expect(actual).to.deep.equal([]);
        })
        .then(done)
        .catch(done);
    });

    it('should list added users ', function (done) {
      api.addUsers(['a', 'b', 'c'])
        .then(() => api.addUsers(['x', 'y', 'z']))
        .then(api.listUsers)
        .then(function (actual) {
          expect(actual).to.deep.equal(['a', 'b', 'c', 'x', 'y', 'z'])
        })
        .then(done)
        .catch(done);
    });
  });

  describe('Find users by', function () {
    var entries = [{
      'id': 'elsa',
      'registered': true
    }, {
      'id': 'anna',
      'registered': false
    }, {
      'id': 'poppy',
      'registered': false,
      'email': 'poppy@mkv25.net'
    }, {
      'id': 'dawn',
      'registered': true
    }];

    beforeEach(resetApi);

    it('should find multiple users using a matcher', function (done) {
      var matcher = (user) => user.registered;
      api.addUsers(entries)
        .then(() => api.findUsersBy(matcher))
        .then(function (actual) {
          var expected = [entries[0], entries[3]];
          expect(actual).to.deep.equal(expected)
        })
        .then(done)
        .catch(done);
    });

    it('should find individual users by id matcher', function (done) {
      var idMatcher = (user) => user.id === 'poppy';
      api.addUsers(entries)
        .then(() => api.findUsersBy(idMatcher))
        .then(function (actual) {
          var expected = [entries[2]];
          expect(actual).to.deep.equal(expected);
        })
        .then(done)
        .catch(done);
    });

    it('should find groups of users by function', function (done) {
      var matcher = (user) => (user.id.length <= 4);
      api.addUsers(entries)
        .then(() => api.findUsersBy(matcher))
        .then(function (actual) {
          var expected = [entries[0], entries[1], entries[3]];
          expect(actual).to.deep.equal(expected)
        })
        .then(done)
        .catch(done);
    });
  });

  describe('Update users by', function () {
    var entries = [{
      'id': 'elsa',
      'registered': true
    }, {
      'id': 'anna',
      'registered': false
    }, {
      'id': 'poppy',
      'registered': false,
    }, {
      'id': 'dawn',
      'registered': true
    }];

    beforeEach(resetApi);

    it('should be able to update a user by id', function (done) {
      var idMatcher = (user) => (user.id === 'poppy');
      api.addUsers(entries)
        .then(() => api.updateUsersBy(idMatcher, {
          'id': 'poppy',
          'email': 'poppy@mkv25.net'
        }))
        .then(function (actual) {
          var expected = [{
            'id': 'poppy',
            'registered': false,
            'email': 'poppy@mkv25.net'
          }];
          expect(actual).to.deep.equal(expected)
        })
        .then(done)
        .catch(done);
    });

    it('should be able to update multiple users by matcher', function (done) {
      var matcher = (user) => (user.registered === false);
      api.addUsers(entries)
        .then(() => api.updateUsersBy(matcher, {
          'registered': true
        }))
        .then(function (actual) {
          var expected = [{
            'id': 'anna',
            'registered': true,
          }, {
            'id': 'poppy',
            'registered': true,
          }];
          expect(actual).to.deep.equal(expected)
        })
        .then(done)
        .catch(done);
    });
  });
});