const nest = require('depnest')

exports.gives = nest('tests')

exports.needs = nest({
  'async.create': 'first',
  'sbot.close': 'first'
})

exports.create = function (api) {

  return nest('tests', tests)

  function tests(obj) {
    obj['create is requireable'] = function(assert, cb) {
      assert(api.async.create) 
      cb()
    }
    obj['creates empty gathering without error'] = function(assert, cb) {
      api.async.create({}, function(err) {
        assert(!err) 
        cb()
      }) 
    }
    return obj
  }  
}

