'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = resdir;

var _path = require('path');

var _fs = require('fs');

var _glob = require('glob');

var _chokidar = require('chokidar');

var _chokidar2 = _interopRequireDefault(_chokidar);

var _includes = require('utilise/includes');

var _includes2 = _interopRequireDefault(_includes);

var _values = require('utilise/values');

var _values2 = _interopRequireDefault(_values);

var _file = require('utilise/file');

var _file2 = _interopRequireDefault(_file);

var _not = require('utilise/not');

var _not2 = _interopRequireDefault(_not);

var _is = require('utilise/is');

var _is2 = _interopRequireDefault(_is);

/* istanbul ignore next */
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// -------------------------------------------
// Loads resources from the /resources folder
// -------------------------------------------
function resdir(ripple) {
  var prefix = arguments.length <= 1 || arguments[1] === undefined ? '.' : arguments[1];

  log('creating');
  if (_is2.default.obj(prefix)) prefix = prefix.dir || '.';

  var argv = require('minimist')(process.argv.slice(2));
  console.log("argv", argv);(argv.r || argv.resdirs || '').split(',').concat(prefix).map(function (path) {
    return (0, _path.resolve)(path);
  }).map(function (prefix) {
    (0, _glob.sync)(prefix + '/resources/**/!(test).{js,css}').filter((0, _not2.default)((0, _includes2.default)('/_'))).map(function (path) {
      return (0, _path.resolve)(prefix, path);
    }).map(function (path) {
      var absolute = (0, _path.resolve)(prefix, path);
      register(ripple)(absolute);
      if (process.env.NODE_ENV != 'production') watch(ripple)(absolute);
    });
  });

  (0, _values2.default)(ripple.resources).map(function (res) {
    return _is2.default.fn(res.headers.loaded) && res.headers.loaded(ripple, res);
  });

  return ripple;
}

var watch = function watch(ripple) {
  return function (path) {
    return _chokidar2.default.watch(path).on('change', function () {
      return register(ripple)(path);
    });
  };
};

var register = function register(ripple) {
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
};

var log = require('utilise/log')('[ri/resdir]');