const nest = require('depnest')

exports.gives = nest('tests')

exports.needs = nest({
  'async.attendees': 'first',
  'sbot.close': 'first',
  'sbot.create': 'first'
})

exports.create = function (api) {

  return nest('tests', tests)

  function tests(tests) {
    tests['attendees is requireable'] = function(assert, cb) {
      assert(api.async.attendees) 
      cb()
    }
    tests['creates attendee without error'] = function(assert, cb) {
      api.sbot.create()
      api.async.attendees({attendees: [{id: '123'}], id: '456'},  function(err) {
        assert(!err) 
        api.sbot.close()
        cb()
      }) 
    }
    return tests
  }  
}

