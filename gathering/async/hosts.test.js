const nest = require('depnest')

exports.gives = nest('tests')

exports.needs = nest({
  'gathering.async.hosts': 'first',
  'sbot.close': 'first',
  'sbot.create': 'first'
})

exports.create = function (api) {
  return nest('tests', tests)

  function tests (tests) {
    tests['hosts is requireable'] = function (assert, cb) {
      assert(api.gathering.async.hosts)
      cb()
    }
    tests['creates host without error'] = function (assert, cb) {
      api.sbot.create()
      api.gathering.async.hosts({hosts: [{link: '123'}], id: {link: '456'}}, function (err) {
        assert(!err)
        api.sbot.close()
        cb()
      })
    }
    return tests
  }
}

