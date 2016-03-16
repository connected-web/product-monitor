var endpoint = function () {}

var server = false;

endpoint.routes = ['/api/exampleGraphs/:name', '/api/exampleGraphs/', '/api/exampleGraphs'];
endpoint.cacheDuration = '1 hour';
endpoint.description = 'An example endpoint for creating graph data in the right format. Supported graphs: donut, and bar';

var graphs = {
  donut: {
    columns: [
      ["http 500", 0.2],
      ["http 200", 1.4],
      ["http 301", 2.5]
    ],
    title: 'Donut Graph Data'
  },
  bar: {
    columns: [
      ["http 500", 0.2, 0.2, 0.2, 0.2, 0.2, 0.4, 0.3, 0.2, 0.2, 0.1, 0.2, 0.2, 0.1, 0.1, 0.2, 0.4, 0.4, 0.3, 0.3, 0.3, 0.2, 0.4, 0.2, 0.5, 0.2, 0.2, 0.4, 0.2, 0.2, 0.2, 0.2, 0.4, 0.1, 0.2, 0.2, 0.2, 0.2, 0.1, 0.2, 0.2, 0.3, 0.3, 0.2, 0.6, 0.4, 0.3, 0.2, 0.2, 0.2, 0.2],
      ["http 200", 1.4, 1.5, 1.5, 1.3, 1.5, 1.3, 1.6, 1.0, 1.3, 1.4, 1.0, 1.5, 1.0, 1.4, 1.3, 1.4, 1.5, 1.0, 1.5, 1.1, 1.8, 1.3, 1.5, 1.2, 1.3, 1.4, 1.4, 1.7, 1.5, 1.0, 1.1, 1.0, 1.2, 1.6, 1.5, 1.6, 1.5, 1.3, 1.3, 1.3, 1.2, 1.4, 1.2, 1.0, 1.3, 1.2, 1.3, 1.3, 1.1, 1.3],
      ["http 301", 2.5, 1.9, 2.1, 1.8, 2.2, 2.1, 1.7, 1.8, 1.8, 2.5, 2.0, 1.9, 2.1, 2.0, 2.4, 2.3, 1.8, 2.2, 2.3, 1.5, 2.3, 2.0, 2.0, 1.8, 2.1, 1.8, 1.8, 1.8, 2.1, 1.6, 1.9, 2.0, 2.2, 1.5, 1.4, 2.3, 2.4, 1.8, 1.8, 2.1, 2.4, 2.3, 1.9, 2.3, 2.5, 2.3, 1.9, 2.0, 2.3, 1.8]
    ],
    title: 'Bar Graph Data'
  }
};

endpoint.configure = function (config) {
  server = config.server;
}

endpoint.render = function (req, res) {
  var data = {};

  // read parameter from route
  var name = req.params.name || undefined;

  // form response
  var data = graphs[name] || {
    error: true,
    message: 'No graph found with the name ' + name,
    advice: Object.keys(graphs).map((key) => `Try /api/exampleGraphs/${key}`)
  };

  // send response
  res.jsonp(data);
}

module.exports = endpoint;
