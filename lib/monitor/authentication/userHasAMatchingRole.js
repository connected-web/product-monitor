var listRolesFor = require('./listRolesFor');

function userHasAMatchingRole(user, requiredRoles) {
  var userRoles = listRolesFor(user);
  for (var i = 0; i < requiredRoles.length; i++) {
    var role = requiredRoles[i];
    if (userRoles.indexOf(role) !== -1) {
      return true;
    }
  }
  return false;
}

module.exports = userHasAMatchingRole;