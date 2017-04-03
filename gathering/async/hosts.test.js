const nest = require('depnest')

exports.gives = nest('tests')

exports.needs = nest({
  'async.hosts': 'first',
  'sbot.close': 'first',
  'sbot.create': 'first'
})

exports.create = function (api) {

  return nest('tests', tests)

  function tests(tests) {
    tests['hosts is requireable'] = function(assert, cb) {
      assert(api.async.hosts) 
      cb()
    }
    tests['creates host without error'] = function(assert, cb) {
      api.sbot.create()
      api.async.hosts({hosts: [{id: '123'}], id: '456'},  function(err) {
        assert(!err) 
        api.sbot.close()
        cb()
      }) 
    }
    return tests
  }  
}

