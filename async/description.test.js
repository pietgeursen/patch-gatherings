const nest = require('depnest')

exports.gives = nest('tests')

exports.needs = nest({
  'async.create': 'first',
  'async.description': 'first',
  'sbot.close': 'first',
  'sbot.create': 'first'
})

exports.create = function (api) {

  return nest('tests', tests)

  function tests(tests) {
    tests['description is requireable'] = function(assert, cb) {
      assert(api.async.description) 
      cb()
    }
    tests['can publish a description message without error'] = function(assert, cb) {
      const description = 'piet'
      const id = 1
      api.sbot.create()
      api.async.description({description, id}, function(err) {
        assert(!err) 
        api.sbot.close()
        cb()
      }) 
    }
    return tests
  }  
}


