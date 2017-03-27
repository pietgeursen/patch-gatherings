const nest = require('depnest')

exports.gives = nest('async.create')

exports.needs = nest({
  'sbot.async.publish': 'first'
})

exports.create = function (api) {
  return nest('async.create', 
    function(data, cb) {
      api.sbot.async.publish({type: 'gathering'}, cb) 
    })
} 
