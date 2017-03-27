const nest = require('depnest')

exports.gives = nest('tests')

exports.needs = nest({
  'pull.find': 'first',
  'sbot.close': 'first'
})

exports.create = function (api) {

  return nest('tests', tests)

  function tests(tests) {
    tests['find is requireable'] = function(assert, cb) {
        assert(api.pull.find) 
        api.sbot.close()
        cb()
    }
    return tests
  }  
}
