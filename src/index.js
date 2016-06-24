// -------------------------------------------
// Loads resources from the /resources folder
// -------------------------------------------
export default function resdir(ripple, prefix = '.'){
  log('creating')
  if (is.obj(prefix)) prefix = prefix.dir || '.'

  var argv = require('minimist')(process.argv.slice(2))

  ;(argv.r || argv.resdirs || '')
    .split(',')
    .concat(prefix)
    .map(path => resolve(path))
    .map(prefix => {
      glob(prefix + '/resources/**/!(test).{js,css}')
        .filter(not(includes('/_')))
        .map(path => resolve(prefix, path))
        .map(path => {
          var absolute = resolve(prefix, path)
          register(ripple)(absolute)
          if (process.env.NODE_ENV != 'production') 
            watch(ripple)(absolute)
        })    
    })

  values(ripple.resources)
    .map(res => is.fn(res.headers.loaded) && res.headers.loaded(ripple, res))

  return ripple
}

const watch = ripple => path => 
  chokidar.watch(path)
    .on('change', () => register(ripple)(path))

const register = ripple => path => {
  var last = basename(path)
    , isJS = extname(path) == '.js'
    , name = isJS ? last.replace('.js', '') : last
    , cach = delete require.cache[path]
    , body = (isJS ? require : file)(path)
    , css  = isJS && exists(path.replace('.js', '.css'))
    , res  = is.obj(body = body.default || body) ? body 
           : css ? { name, body, headers: { needs: '[css]' } } 
                 : { name, body } 

  return ripple(res)
}

import { resolve, basename, extname } from 'path'
import { existsSync as exists } from 'fs'
import { sync as glob } from 'glob'
import chokidar from 'chokidar'
import includes from 'utilise/includes'
import values from 'utilise/values'
import file from 'utilise/file'
import not from 'utilise/not'
import is from 'utilise/is'
const log = require('utilise/log')('[ri/resdir]')