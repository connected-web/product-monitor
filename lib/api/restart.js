var instance = function () {}

var server = false;

instance.method = "post";
instance.routes = ["/api/restart"];
instance.cacheDuration = "1 second";

instance.configure = function (config) {

}

instance.render = function (req, res) {
  var data = false;

  data = {
    message: "testing post"
  };

  res.send(data);
}

module.exports = instance;
