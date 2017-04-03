const nest = require('depnest')
const pull = require('pull-stream')

exports.gives = nest('async.hosts')

exports.needs = nest({
  'sbot.async.publish': 'first'
})

exports.create = function (api) {
  return nest('async.hosts', function(data, cb) {
    pull(
      pull.values(data.hosts), 
      pull.asyncMap((host, cb) =>{
        api.sbot.async.publish({type: 'about', about: data.id, host}, cb) 
      }),
      pull.collect(cb)
    )
  })
} 
