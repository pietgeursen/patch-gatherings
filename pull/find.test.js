const nest = require('depnest')
const pull = require('pull-stream')
const moment = require('moment')

exports.gives = nest('tests')

exports.needs = nest({
  'pull.find': 'first',
  'sbot.close': 'first',
  'sbot.create': 'first',
  'async.create': 'first',
  'async.startDateTime': 'first'
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
    tests['can create and find a future gathering'] = function(assert, cb) {
      api.sbot.create()
      api.async.create({}, function(err) {
        assert(!err) 
        pull(
          api.pull.find({past: false, future: true}),
          pull.drain(function(data) {
            assert(data) 
            api.sbot.close()
            cb()
          })
        )
      }) 
    }
    tests['can create and find a past gathering'] = function(assert, cb) {
      api.sbot.create()
      api.async.create({}, function(err) {
        assert(!err) 
        pull(
          api.pull.find({past: true, future: false}),
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
