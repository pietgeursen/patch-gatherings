const nest = require('depnest')

exports.gives = nest('tests')

exports.needs = nest({
  'gathering.async.create': 'first',
  'gathering.async.title': 'first',
  'sbot.close': 'first',
  'sbot.create': 'first'
})

exports.create = function (api) {
  return nest('tests', tests)

  function tests (tests) {
    tests['title is requireable'] = function (assert, cb) {
      assert(api.gathering.async.title)
      cb()
    }
    tests['can publish a title message without error'] = function (assert, cb) {
      const title = 'piet'
      const id = 1
      api.sbot.create()
      api.gathering.async.title({title, gathering: id}, function (err) {
        assert(!err)
        api.sbot.close()
        cb()
      })
    }
    return tests
  }
}
