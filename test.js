var expect = require('chai').expect
  , client = require('utilise/client')
  , time = require('utilise/time')
  , path = require('path')
  , core = require('rijs.core').default
  , css = require('rijs.css').default
  , fn = require('rijs.fn').default
  , resdir = require('./').default
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

  it('should auto load from specific dir with opts', function(){  
    var ripple = resdir(fn(css(core())), { dir: path.resolve() })
    expect(ripple('foo')).to.be.a('function')
    expect(ripple('foo').name).to.eql('foo')
    expect(ripple('bar.css')).to.equal('.bar {}')
    expect(ripple('sth')).to.be.a('function')
    expect(ripple('data')).to.be.eql(String)
    expect(ripple.resources.test).to.not.be.ok
  })

  it('should auto load resources folder when no dir prop on opts', function(){  
    var ripple = resdir(fn(css(core())), { })
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

    time(50, function(){
      expect(ripple('foo').name).to.be.eql('baz')
      fs.writeFileSync('./resources/foo.js', 'module.exports = function foo(){ }')
      done()
    })

  })

  it('should not watch for changes in prod', function(done){  
    var original = process.env.NODE_ENV
    process.env.NODE_ENV = 'production'
    var ripple = resdir(fn(css(core())), path.resolve())

    expect(ripple('foo').name).to.be.eql('foo')
    fs.writeFileSync('./resources/foo.js', 'module.exports = function baz(){ }')

    time(500, function(){
      expect(ripple('foo').name).to.be.eql('foo')
      fs.writeFileSync('./resources/foo.js', 'module.exports = function foo(){ }')
      done()
    })

    process.env.NODE_ENV = original    
  })

  it('should not auto-add needs header for default styles', function(){  
    var ripple = resdir(fn(css(core())))
    expect(ripple('component')).to.be.a('function')
    expect(ripple('component.css')).to.be.eql(':host {}')
    expect(ripple.resources.component.headers.needs).to.be.eql('[css]')
    expect(ripple.resources.foo.headers.needs).to.be.not.ok
  })

  it('should ignore resources prefixed with _', function(){  
    var ripple = resdir(fn(css(core())))
    expect(ripple('ignore')).to.not.be.ok
  })

  it('should invoke loaded function', function(){  
    var ripple = resdir(fn(css(core())))
    expect(loadedResdir[0]).to.eql(ripple)
    expect(loadedResdir[1].name).to.eql('data')
    expect(loadedResdir[1].body).to.eql(String)
  })

  it('should load from additional resdirs from command line', function(){  
    process.argv = [
      0
    , 0
    , '--resdirs'
    , './tertiary,./secondary'
    ]

    var ripple = resdir(fn(core()))
    expect('data' in ripple.resources).to.be.ok
    expect('secondary' in ripple.resources).to.be.ok
    expect('tertiary' in ripple.resources).to.be.ok
  })

  it('should load from additional resdirs from command line - shortcut', function(){  
    process.argv = [
      0
    , 0
    , '-r'
    , './tertiary,./secondary'
    ]

    var ripple = resdir(fn(core()))
    expect('data' in ripple.resources).to.be.ok
    expect('secondary' in ripple.resources).to.be.ok
    expect('tertiary' in ripple.resources).to.be.ok
  })
})