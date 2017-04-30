const nest = require('depnest')

exports.gives = nest('tests')

exports.needs = nest({
  'gathering.async.create': 'first',
  'gathering.async.startDateTime': 'first',
  'sbot.close': 'first',
  'sbot.create': 'first'
})

exports.create = function (api) {
  return nest('tests', tests)

  function tests (tests) {
    tests['startDateTime is requireable'] = function (assert, cb) {
      assert(api.gathering.async.startDateTime)
      cb()
    }
    tests['can publish a startDateTime message without error'] = function (assert, cb) {
      const startDateTime = 'piet'
      const link = 1
      api.sbot.create()
      api.gathering.async.startDateTime({startDateTime, link}, function (err) {
        assert(!err)
        api.sbot.close()
        cb()
      })
    }
    return tests
  }
}

