const nest = require('depnest')

exports.gives = nest('async.startDateTime')

exports.needs = nest({
  'sbot.async.publish': 'first'
})

exports.create = function (api) {
  return nest('async.startDateTime', function({startDateTime, id}, cb) {
    api.sbot.async.publish({type: 'about', about: id, startDateTime}, cb) 
  })
} 
