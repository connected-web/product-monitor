function listRolesFor(user) {
  var roles = [];

  if (user) {
    if (user.name) {
      roles.push('named');
    }

    if (user.email) {
      roles.push('emailable');
    }

    if (user.roles) {
      roles = [].concat(roles, user.roles);
    }
  }

  return roles;
}

module.exports = listRolesFor;