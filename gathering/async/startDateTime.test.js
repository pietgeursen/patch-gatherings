const nest = require('depnest')

exports.gives = nest('tests')

exports.needs = nest({
  'async.create': 'first',
  'async.startDateTime': 'first',
  'sbot.close': 'first',
  'sbot.create': 'first'
})

exports.create = function (api) {

  return nest('tests', tests)

  function tests(tests) {
    tests['startDateTime is requireable'] = function(assert, cb) {
      assert(api.async.startDateTime) 
      cb()
    }
    tests['can publish a startDateTime message without error'] = function(assert, cb) {
      const startDateTime = 'piet'
      const id = 1
      api.sbot.create()
      api.async.startDateTime({startDateTime, id}, function(err) {
        assert(!err) 
        api.sbot.close()
        cb()
      }) 
    }
    return tests
  }  
}


