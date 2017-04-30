const nest = require('depnest')
const pull = require('pull-stream')

exports.gives = nest('tests')

exports.needs = nest({
  'gathering.pull.find': 'first',
  'sbot.close': 'first',
  'sbot.create': 'first',
  'gathering.async.create': 'first',
  'gathering.async.startDateTime': 'first'
})

exports.create = function (api) {
  return nest('tests', tests)

  function tests (tests) {
    tests['find is requireable'] = function (assert, cb) {
      assert(api.gathering.pull.find)
      cb()
    }
    tests['can create and find a gathering'] = function (assert, cb) {
      api.sbot.create()
      api.gathering.async.create({}, function (err) {
        assert(!err)
        pull(
          api.gathering.pull.find({past: true, future: true}),
          pull.drain(function (data) {
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
