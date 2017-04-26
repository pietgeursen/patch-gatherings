const nest = require('depnest')

exports.gives = nest('tests')

exports.needs = nest({
  'gathering.async.create': 'first',
  'gathering.async.location': 'first',
  'sbot.close': 'first',
  'sbot.create': 'first'
})

exports.create = function (api) {

  return nest('tests', tests)

  function tests(tests) {
    tests['location is requireable'] = function(assert, cb) {
      assert(api.gathering.async.location) 
      cb()
    }
    tests['can publish a location message without error'] = function(assert, cb) {
      const location = 'piet'
      const link = 1
      api.sbot.create()
      api.gathering.async.location({location, link}, function(err) {
        assert(!err) 
        api.sbot.close()
        cb()
      }) 
    }
    return tests
  }  
}


