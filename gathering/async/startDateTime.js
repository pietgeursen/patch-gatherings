const nest = require('depnest')

exports.gives = nest('gathering.async.startDateTime')

exports.needs = nest({
  'sbot.async.publish': 'first'
})

exports.create = function (api) {
  return nest('gathering.async.startDateTime', function({startDateTime, id}, cb) {
    api.sbot.async.publish({type: 'about', about: id, startDateTime}, cb) 
  })
} 
