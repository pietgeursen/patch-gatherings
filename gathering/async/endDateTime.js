const nest = require('depnest')

exports.gives = nest('gathering.async.endDateTime')

exports.needs = nest({
  'sbot.async.publish': 'first'
})

exports.create = function (api) {
  return nest('gathering.async.endDateTime', function({endDateTime, id}, cb) {
    api.sbot.async.publish({type: 'about', about: id, endDateTime}, cb) 
  })
} 
