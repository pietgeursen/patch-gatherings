const nest = require('depnest')

exports.gives = nest('tests')

exports.needs = nest({
  'async.create': 'first',
  'async.title': 'first',
  'sbot.close': 'first',
  'sbot.create': 'first'
})

exports.create = function (api) {

  return nest('tests', tests)

  function tests(tests) {
    tests['title is requireable'] = function(assert, cb) {
      assert(api.async.title) 
      cb()
    }
    tests['can publish a title message without error'] = function(assert, cb) {
      const title = 'piet'
      const id = 1
      api.sbot.create()
      api.async.title({title, id}, function(err) {
        assert(!err) 
        api.sbot.close()
        cb()
      }) 
    }
    return tests
  }  
}

