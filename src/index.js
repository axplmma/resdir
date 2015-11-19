// -------------------------------------------
// Loads resources from the /resources folder
// -------------------------------------------
export default function resdir(ripple, prefix = '.'){
  log('creating')
  if (is.obj(prefix)) prefix = prefix.dir || '.'
  glob(prefix + '/resources/**/!(test).{js,css}')
    .map(function(path){
      var absolute = resolve(prefix, path)
      register(ripple)(absolute)
      if (process.env.NODE_ENV != 'production') 
        watch(ripple)(absolute)
    })

  return ripple
}

function watch(ripple){
  return function(path){
    chokidar.watch(path)
      .on('change', () => register(ripple)(path))
  }
}

function register(ripple){
  return function(path) {
    var last = basename(path)
      , isjs = extname(path) == '.js'
      , name = isjs ? last.replace('.js', '') : last
      , cach = delete require.cache[path]
      , body = (isjs ? require : file)(path)
      , res  = is.obj(body = body.default || body) ? body : { name, body } 

    return ripple(res)
  }
}

import { resolve, basename, extname } from 'path'
import client from 'utilise/client'
import { sync as glob } from 'glob'
import file from 'utilise/file'
import chokidar from 'chokidar'
import is from 'utilise/is'
import fs from 'fs'
var log = require('utilise/log')('[ri/resdir]')