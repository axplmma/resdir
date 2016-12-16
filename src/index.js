// -------------------------------------------
// Loads resources from the /resources folder
// -------------------------------------------
export default function resdir(ripple, { dir = '.' } = {}){
  log('creating')

  var argv = require('minimist')(process.argv.slice(2))

  ;(argv.r || argv.resdirs || '')
    .split(',')
    .concat(dir)
    .filter(Boolean)
    .map(path => resolve(path))
    .map(dir => {
      glob(dir + '/resources/**/!(test).{js,css}')
        .filter(not(includes('/_')))
        .map(path => resolve(dir, path))
        .map(path => {
          var absolute = resolve(dir, path)
          register(ripple)(absolute)
          if (process.env.NODE_ENV != 'production') 
            watch(ripple)(absolute)
        })    
    })

  values(ripple.resources)
    .map(loaded(ripple))

  return ripple
}

const watch = ripple => path => 
  chokidar.watch(path)
    .on('change', () => loaded(ripple)(register(ripple)(path)))

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

  return ripple(res), ripple.resources[name]
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
    , loaded = ripple => res => is.fn(res.headers.loaded) && res.headers.loaded(ripple, res)