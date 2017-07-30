'use strict';

// -------------------------------------------
// Loads resources from the /resources folder
// -------------------------------------------
module.exports = function resdir(ripple) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$dir = _ref.dir,
      dir = _ref$dir === undefined ? '.' : _ref$dir,
      _ref$watch = _ref.watch,
      watch = _ref$watch === undefined ? isNonProd() : _ref$watch,
      _ref$glob = _ref.glob,
      glob = _ref$glob === undefined ? '/resources/**/!(*test).{js,css}' : _ref$glob;

  log('creating', { watch: watch });
  var argv = require('minimist')(process.argv.slice(2)),
      folders = (argv.r || argv.resdirs || '').split(',').concat(dir).filter(Boolean).map(function (d) {
    return resolve(d);
  }).map(append(glob)),
      watcher = chokidar.watch(folders, { ignored: /\b_/ }).on('error', err).on('add', register(ripple)).on('change', register(ripple)).on('ready', async function () {
    if (!watch) watcher.close();
    await Promise.all(values(ripple.resources).map(loaded(ripple)));

    def(ripple, 'ready', true);
    ripple.emit('ready');
  });

  return ripple;
};

var register = function register(ripple) {
  return function (path) {
    var last = basename(path),
        isJS = extname(path) == '.js',
        name = isJS ? last.replace('.js', '') : last,
        cach = delete require.cache[path],
        body = (isJS ? require : file)(path),
        css = isJS && exists(path.replace('.js', '.css')),
        res = is.obj(body = body.default || body) ? body : css ? { name: name, body: body, headers: { needs: '[css]' } } : { name: name, body: body };

    ripple(res);

    if (ripple.ready) loaded(ripple)(ripple.resources[res.name]);
  };
};

function isNonProd() {
  return lo(process.env.NODE_ENV) != 'prod' && lo(process.env.NODE_ENV) != 'production';
}

var _require = require('path'),
    resolve = _require.resolve,
    basename = _require.basename,
    extname = _require.extname,
    exists = require('fs').existsSync,
    chokidar = require('chokidar'),
    append = require('utilise/append'),
    values = require('utilise/values'),
    file = require('utilise/file'),
    def = require('utilise/def'),
    is = require('utilise/is'),
    lo = require('utilise/lo'),
    log = require('utilise/log')('[ri/resdir]'),
    err = require('utilise/err')('[ri/resdir]'),
    loaded = function loaded(ripple) {
  return function (res) {
    return is.fn(res.headers.loaded) && res.headers.loaded(ripple, res);
  };
};