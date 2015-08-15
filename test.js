!(require('utilise/client')) && !function(){

var expect = require('chai').expect
  , client = require('utilise/client')
  , resdir = require('./')
  , path = require('path')
  , core = require('rijs.core')
  , css = require('rijs.css')
  , fn = require('rijs.fn')
  , fs = require('fs')
 
describe('Resources Folder', function(){

  it('should auto load resources folder', function(){  
    var ripple = resdir(fn(css(core())))
    expect(ripple('foo')).to.be.a('function')
    expect(ripple('foo').name).to.eql('foo')
    expect(ripple('bar.css')).to.equal('.bar {}')
    expect(ripple('sth')).to.be.a('function')
    expect(ripple('data')).to.be.eql(String)
    expect(ripple.resources.test).to.not.be.ok
  })

  it('should auto load from specific dir', function(){  
    var ripple = resdir(fn(css(core())), path.resolve())
    expect(ripple('foo')).to.be.a('function')
    expect(ripple('foo').name).to.eql('foo')
    expect(ripple('bar.css')).to.equal('.bar {}')
    expect(ripple('sth')).to.be.a('function')
    expect(ripple('data')).to.be.eql(String)
    expect(ripple.resources.test).to.not.be.ok
  })

  it('should watch for changes', function(done){  
    var ripple = resdir(fn(css(core())), path.resolve())
    expect(ripple('foo').name).to.be.eql('foo')
    fs.writeFileSync('./resources/foo.js', 'module.exports = function baz(){ }')

    setTimeout(function(){
      expect(ripple('foo').name).to.be.eql('baz')
      fs.writeFileSync('./resources/foo.js', 'module.exports = function foo(){ }')
      done()
    }, 50)
  })

  it('should not watch for changes in prod', function(done){  
    var original = process.env.NODE_ENV
    process.env.NODE_ENV = 'production'

    var ripple = resdir(fn(css(core())), path.resolve())
    expect(ripple('foo').name).to.be.eql('foo')
    fs.writeFileSync('./resources/foo.js', 'module.exports = function baz(){ }')

    setTimeout(function(){
      expect(ripple('foo').name).to.be.eql('foo')
      fs.writeFileSync('./resources/foo.js', 'module.exports = function foo(){ }')
      done()
    }, 50)
    process.env.NODE_ENV = original
  })

})

}()