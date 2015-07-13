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
      var js = ~path.indexOf('.js')
        , name = js ? path.replace('.js', '') : path
        , body = (js ? require : file)(resolve(folder, path))
        , res  = is.obj(body) ? body : { name, body } 

      return !ripple.resources[name]
          &&  ripple(res)
    })

  return ripple
}

import client from 'utilise/client'
import file from 'utilise/file'
import log from 'utilise/log'
import is from 'utilise/is'
import { resolve } from 'path'
import fs from 'fs'
log = log('[ri/resdir]')