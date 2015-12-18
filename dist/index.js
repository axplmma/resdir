'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = resdir;

var _path = require('path');

var _client = require('utilise/client');

var _client2 = _interopRequireDefault(_client);

var _glob = require('glob');

var _file = require('utilise/file');

var _file2 = _interopRequireDefault(_file);

var _chokidar = require('chokidar');

var _chokidar2 = _interopRequireDefault(_chokidar);

var _is = require('utilise/is');

var _is2 = _interopRequireDefault(_is);

var _fs = require('fs');

/* istanbul ignore next */
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// -------------------------------------------
// Loads resources from the /resources folder
// -------------------------------------------
function resdir(ripple) {
  var prefix = arguments.length <= 1 || arguments[1] === undefined ? '.' : arguments[1];

  log('creating');
  if (_is2.default.obj(prefix)) prefix = prefix.dir || '.';
  (0, _glob.sync)(prefix + '/resources/**/!(test).{js,css}').map(function (path) {
    var absolute = (0, _path.resolve)(prefix, path);
    register(ripple)(absolute);
    if (process.env.NODE_ENV != 'production') watch(ripple)(absolute);
  });

  return ripple;
}

function watch(ripple) {
  return function (path) {
    _chokidar2.default.watch(path).on('change', function () {
      return register(ripple)(path);
    });
  };
}

function register(ripple) {
  return function (path) {
    var last = (0, _path.basename)(path),
        isJS = (0, _path.extname)(path) == '.js',
        name = isJS ? last.replace('.js', '') : last,
        cach = delete require.cache[path],
        body = (isJS ? require : _file2.default)(path),
        css = isJS && (0, _fs.existsSync)(path.replace('.js', '.css')),
        res = _is2.default.obj(body = body.default || body) ? body : css ? { name: name, body: body, headers: { needs: '[css]' } } : { name: name, body: body };

    return ripple(res);
  };
}

var log = require('utilise/log')('[ri/resdir]');