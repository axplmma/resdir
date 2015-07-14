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
    var js = ~path.indexOf(".js"),
        name = js ? path.replace(".js", "") : path,
        body = (js ? require : file)(resolve(folder, path)),
        res = is.obj(body) ? body : { name: name, body: body };

    return !ripple.resources[name] && ripple(res);
  });

  return ripple;
}

var client = _interopRequire(require("utilise/client"));

var file = _interopRequire(require("utilise/file"));

var log = _interopRequire(require("utilise/log"));

var is = _interopRequire(require("utilise/is"));

var resolve = require("path").resolve;

var fs = _interopRequire(require("fs"));

log = log("[ri/resdir]");