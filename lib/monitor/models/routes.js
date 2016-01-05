var routes = {};

function addRoute(group, type, path, method, description, cacheTime) {
  pathCheck(routes, group, {});
  pathCheck(routes[group], type, {});
  if (routes[group][type][path]) {
    throw 'Route has already been added ' + arguments.join(', ');
  }
  routes[group][type][path] = {
    path: path,
    method: method,
    description: description,
    cacheTime: cacheTime
  };
}

function pathCheck(base, property, defaultValue) {
  base[property] = base[property] || defaultValue;
}

function get() {
  return routes;
}

module.exports = {
  add: addRoute,
  get: get
};
