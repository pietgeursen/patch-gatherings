const nest = require('depnest')

exports.gives = nest('async.description')

exports.needs = nest({
  'sbot.async.publish': 'first'
})

exports.create = function (api) {
  return nest('async.description', function({description, id}, cb) {
    api.sbot.async.publish({type: 'about', about: id, description}, cb) 
  })
} 
