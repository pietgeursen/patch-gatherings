const nest = require('depnest')
const pull = require('pull-stream')

exports.gives = nest('gathering.async.hosts')

exports.needs = nest({
  'sbot.async.publish': 'first'
})

exports.create = function (api) {
  return nest('gathering.async.hosts', function(data, cb) {
    pull(
      pull.values(data.hosts), 
      pull.asyncMap((host, cb) =>{
        api.sbot.async.publish({type: 'about', link: data.gathering, host: {link: host.id, remove: host.remove}}, cb)
      }),
      pull.collect(cb)
    )
  })
} 
