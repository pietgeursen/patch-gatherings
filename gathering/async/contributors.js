const nest = require('depnest')
const pull = require('pull-stream')

exports.gives = nest('gathering.async.contributors')

exports.needs = nest({
  'sbot.async.publish': 'first'
})

exports.create = function (api) {
  return nest('gathering.async.contributors', function(data, cb) {
    pull(
      pull.values(data.contributors), 
      pull.asyncMap((contributor, cb) =>{
        api.sbot.async.publish({type: 'about', about: data.id, contributor}, cb) 
      }),
      pull.collect(cb)
    )
  })
} 
