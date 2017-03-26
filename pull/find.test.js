var nest = require('depnest')

exports.gives = nest('test')

exports.needs = nest({
  'pull.find': 'first',
  'sbot.close': 'first'
})

exports.create = function (api) {

  return nest('test', test)

  function test() {
    return {
      ['find is requireable']: function(assert, cb) {
        assert(api.pull.find) 
        api.sbot.close()
        cb()
      }
    }  
  }
}
