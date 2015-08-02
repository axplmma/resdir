"use strict";

/* istanbul ignore next */
var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

// -------------------------------------------
// Loads resources from the /resources folder
// -------------------------------------------
module.exports = resdir;

function resdir(ripple, prefix) {
  log("creating");

  if (client) {
    return identity;
  }var folder = prefix ? resolve(prefix, "./resources") : resolve("./resources");

  fs.existsSync(folder) && fs.readdirSync(folder).forEach(function (path) {
    var absolute = resolve(folder, path);

    register(ripple)(absolute);

    if (process.env.NODE_ENV != "production") watch(ripple)(absolute);
  });

  return ripple;
}

function watch(ripple) {
  return function (path) {
    chokidar.watch(path).on("change", function () {
      return register(ripple)(path);
    });
  };
}

function register(ripple) {
  return function (path) {
    var last = basename(path),
        isjs = extname(path) == ".js",
        name = isjs ? last.replace(".js", "") : last,
        cach = delete require.cache[path],
        body = (isjs ? require : file)(path),
        res = is.obj(body) ? body : { name: name, body: body };

    return ripple(res);
  };
}

var _path = require("path");

var resolve = _path.resolve;
var basename = _path.basename;
var extname = _path.extname;

var client = _interopRequire(require("utilise/client"));

var file = _interopRequire(require("utilise/file"));

var log = _interopRequire(require("utilise/log"));

var is = _interopRequire(require("utilise/is"));

var chokidar = _interopRequire(require("chokidar"));

var fs = _interopRequire(require("fs"));

log = log("[ri/resdir]");