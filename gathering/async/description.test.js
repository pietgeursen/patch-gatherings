const nest = require('depnest')

exports.gives = nest('tests')

exports.needs = nest({
  'gathering.async.create': 'first',
  'gathering.async.description': 'first',
  'sbot.close': 'first',
  'sbot.create': 'first'
})

exports.create = function (api) {
  return nest('tests', tests)

  function tests (tests) {
    tests['description is requireable'] = function (assert, cb) {
      assert(api.gathering.async.description)
      cb()
    }
    tests['can publish a description message without error'] = function (assert, cb) {
      const description = 'piet'
      const link = 1
      api.sbot.create()
      api.gathering.async.description({description, link}, function (err) {
        assert(!err)
        api.sbot.close()
        cb()
      })
    }
    return tests
  }
}
