// -------------------------------------------
// Loads resources from the /resources folder
// -------------------------------------------
export default function resdir(ripple, prefix){
  log('creating')
  
  if (client) return identity
  var folder = prefix 
        ? resolve(prefix, './resources')
        : resolve('./resources')

  fs.existsSync(folder) && fs.readdirSync(folder)
    .forEach(function(path){
      var absolute = resolve(folder, path)
        
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
      , res  = is.obj(body) ? body : { name, body } 

    return ripple(res)
  }
}

import { resolve, basename, extname } from 'path'
import client from 'utilise/client'
import file from 'utilise/file'
import log from 'utilise/log'
import is from 'utilise/is'
import chokidar from 'chokidar'
import fs from 'fs'
log = log('[ri/resdir]')