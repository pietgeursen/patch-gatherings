const pull = require('pull-stream')
const nest = require('depnest')

exports.gives = nest('tests')

exports.needs = nest({
  'pull.find': 'first',
  'async.create': 'first',
  'sbot.close': 'first',
  'sbot.create': 'first'
})

exports.create = function (api) {

  return nest('tests', tests)

  function tests(tests) {
    tests['find is requireable'] = function(assert, cb) {
      assert(api.pull.find) 
      cb()
    }
    tests['can create and find a gathering'] = function(assert, cb) {
      api.sbot.create()
      api.async.create({}, function(err) {
        assert(!err) 
        pull(
          api.pull.find(),
          pull.drain(function(data) {
            assert(data) 
            api.sbot.close()
            cb()
          })
        )
      }) 
    }
    return tests
  }  
}

