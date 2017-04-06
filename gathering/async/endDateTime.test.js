const nest = require('depnest')

exports.gives = nest('tests')

exports.needs = nest({
  'gathering.async.create': 'first',
  'gathering.async.endDateTime': 'first',
  'sbot.close': 'first',
  'sbot.create': 'first'
})

exports.create = function (api) {

  return nest('tests', tests)

  function tests(tests) {
    tests['endDateTime is requireable'] = function(assert, cb) {
      assert(api.gathering.async.endDateTime) 
      cb()
    }
    tests['can publish a endDateTime message without error'] = function(assert, cb) {
      const endDateTime = 'piet'
      const id = 1
      api.sbot.create()
      api.gathering.async.endDateTime({endDateTime, id}, function(err) {
        assert(!err) 
        api.sbot.close()
        cb()
      }) 
    }
    return tests
  }  
}

