module.exports = function (req, res) {
  var request = require('request');
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
