const nest = require('depnest')

exports.gives = nest('gathering.async.location')

exports.needs = nest({
  'sbot.async.publish': 'first'
})

exports.create = function (api) {
  return nest('gathering.async.location', function({location, id}, cb) {
    api.sbot.async.publish({type: 'about', about: id, location}, cb) 
  })
} 
