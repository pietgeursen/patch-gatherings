const nest = require('depnest')

exports.gives = nest('tests')

exports.needs = nest({
  'async.create': 'first',
  'async.location': 'first',
  'sbot.close': 'first',
  'sbot.create': 'first'
})

exports.create = function (api) {

  return nest('tests', tests)

  function tests(tests) {
    tests['location is requireable'] = function(assert, cb) {
      assert(api.async.location) 
      cb()
    }
    tests['can publish a location message without error'] = function(assert, cb) {
      const location = 'piet'
      const id = 1
      api.sbot.create()
      api.async.location({location, id}, function(err) {
        assert(!err) 
        api.sbot.close()
        cb()
      }) 
    }
    return tests
  }  
}


