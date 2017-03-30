const nest = require('depnest')

exports.gives = nest('tests')

exports.needs = nest({
  'async.create': 'first',
  'sbot.close': 'first',
  'sbot.create': 'first'
})

exports.create = function (api) {

  return nest('tests', tests)

  function tests(tests) {
    tests['create is requireable'] = function(assert, cb) {
      assert(api.async.create) 
      cb()
    }
    tests['creates empty gathering without error'] = function(assert, cb) {
      console.log('here')
      api.sbot.create()
      api.async.create({}, function(err) {
        assert(!err) 
        api.sbot.close()
        cb()
      }) 
    }
    return tests
  }  
}

