const nest = require('depnest')

exports.gives = nest('async.title')

exports.needs = nest({
  'sbot.async.publish': 'first'
})

exports.create = function (api) {
  return nest('async.title', function({title, id}, cb) {
    api.sbot.async.publish({type: 'about', about: id, title}, cb) 
  })
} 
