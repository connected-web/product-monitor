var write = require('promise-path').write
var _ = require('lodash')

function create (path) {
  var users = {
    list: []
  }

  var usersDbFile = path + '/users-db.json'
  var setup = Promise.accept()
  try {
    var data = require(usersDbFile)
    _.merge(users, data)
  } catch (ex) {
    setup = saveUsers()
  }

  /* Save back to the user database */
  function saveUsers () {
    return write(usersDbFile, JSON.stringify(users, null, '  '))
  }

  /* Find users by a matcher function - returns a promise containing a cloned list of matching users */
  function findUsersBy (matcher) {
    var finds = []
    users.list.forEach(function (user) {
      var entry = _.cloneDeep(user)
      if (matcher(entry)) {
        finds.push(entry)
      }
    })
    return Promise.accept(finds)
  }

  /* List users - returns a promise containing a cloned list of users */
  function listUsers () {
    return Promise.accept(_.cloneDeep(users.list))
  }

  /* Add users - saves the users, then returns a cloned list of users */
  function addUsers (newUsers) {
    newUsers.forEach(function (user) {
      var entry = _.cloneDeep(user)
      users.list.push(entry)
    })

    return saveUsers().then(listUsers)
  }

  /* Remove users by an identifying field - returns a list of removed users */
  function removeUsersBy (field, value) {
    var removed = [],
      list = []

    users.list.forEach(function (user) {
      (user[field] === value) ? removed.push(user) : list.push(user)
    })
    users.list = list

    return saveUsers().then(() => Promise.accept(removed))
  }

  /* Update users by providing a matcher function, and properties to merge - returns a promise containing a cloned list of affected users */
  function updateUsersBy (matcher, data) {
    return findUsersBy(matcher)
      .then(function (entries) {
        return entries.map((user) => _.merge(user, data))
      })
      .then(function (entries) {
        return _.cloneDeep(entries)
      })
  }

  /* Return a promise that contains the API once setup has completed */
  return setup.then(function () {
    return {
      findUsersBy,
      listUsers,
      addUsers,
      removeUsersBy,
      updateUsersBy
    }
  })
}

module.exports = create
