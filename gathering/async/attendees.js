const nest = require('depnest')
const pull = require('pull-stream')

exports.gives = nest('gathering.async.attendees')

exports.needs = nest({
  'sbot.async.publish': 'first'
})

exports.create = function (api) {
  return nest('gathering.async.attendees', function(data, cb) {
    pull(
      pull.values(data.attendees), 
      pull.asyncMap((attendee, cb) =>{
        api.sbot.async.publish({type: 'about', about: data.id, attendee}, cb) 
      }),
      pull.collect(cb)
    )
  })
} 
