const nest = require('depnest')

exports.gives = nest('async.endDateTime')

exports.needs = nest({
  'sbot.async.publish': 'first'
})

exports.create = function (api) {
  return nest('async.endDateTime', function({endDateTime, id}, cb) {
    api.sbot.async.publish({type: 'about', about: id, endDateTime}, cb) 
  })
} 
