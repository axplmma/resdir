var expect = require('chai').expect
  , client = require('client')
  , resdir = require('./')
  , core = require('core')
  , css = require('css')
  , fn = require('fn')

describe('Resources Folder', function(){

  it('should auto load resources folder', function(){  
    var ripple = resdir(fn(css(core())))
    expect(ripple('foo')).to.be.a('function')
    expect(ripple('foo').name).to.eql('foo')
    expect(ripple('bar.css')).to.equal('.bar {}')
  })

})