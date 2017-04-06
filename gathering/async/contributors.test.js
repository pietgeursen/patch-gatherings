const nest = require('depnest')

exports.gives = nest('tests')

exports.needs = nest({
  'gathering.async.contributors': 'first',
  'sbot.close': 'first',
  'sbot.create': 'first'
})

exports.create = function (api) {

  return nest('tests', tests)

  function tests(tests) {
    tests['contributors is requireable'] = function(assert, cb) {
      assert(api.gathering.async.contributors) 
      cb()
    }
    tests['creates contributor without error'] = function(assert, cb) {
      api.sbot.create()
      api.gathering.async.contributors({contributors: [{id: '123'}], id: '456'},  function(err) {
        assert(!err) 
        api.sbot.close()
        cb()
      }) 
    }
    return tests
  }  
}

