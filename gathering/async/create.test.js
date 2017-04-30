const nest = require('depnest')

exports.gives = nest('tests')

exports.needs = nest({
  'gathering.async.create': 'first',
  'sbot.close': 'first',
  'sbot.create': 'first'
})

exports.create = function (api) {
  return nest('tests', tests)

  function tests (tests) {
    tests['create is requireable'] = function (assert, cb) {
      assert(api.gathering.async.create)
      cb()
    }
    tests['creates empty gathering without error'] = function (assert, cb) {
      api.sbot.create()
      api.gathering.async.create({}, function (err) {
        assert(!err)
        api.sbot.close()
        cb()
      })
    }
    return tests
  }
}

