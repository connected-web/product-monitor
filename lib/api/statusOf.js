var request = require('request');

module.exports = function (req, res) {

  var url = req.query.url;

  request(url, function(error, response, body) {
    if(!error) {
      res.jsonp({
          "statusCode": response.statusCode,
          "urlProvided" : url
      });
    }
    else {
      res.jsonp({
          "error": error,
          "urlProvided" : url
      });
    }
  });
}
