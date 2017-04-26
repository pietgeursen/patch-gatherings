const nest = require('depnest')

exports.gives = nest('tests')

exports.needs = nest({
  'gathering.async.images': 'first',
  'sbot.close': 'first',
  'sbot.create': 'first'
})

exports.create = function (api) {

  return nest('tests', tests)

  function tests(tests) {
    tests['images is requireable'] = function(assert, cb) {
      assert(api.gathering.async.images) 
      cb()
    }
    tests['creates image without error'] = function(assert, cb) {
      api.sbot.create()
      api.gathering.async.images({images: [{id: '123'}], link: '456'},  function(err) {
        assert(!err) 
        api.sbot.close()
        cb()
      }) 
    }
    return tests
  }  
}

