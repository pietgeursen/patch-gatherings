const nest = require('depnest')

exports.gives = nest('async.location')

exports.needs = nest({
  'sbot.async.publish': 'first'
})

exports.create = function (api) {
  return nest('async.location', function({location, id}, cb) {
    api.sbot.async.publish({type: 'about', about: id, location}, cb) 
  })
} 
