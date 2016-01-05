function configure(app) {
  function loadPlugins() {
    return Promise.accept();
  }

  return {
    loadPlugins
  };
}

module.exports = {
  configure
};