const nest = require('depnest')

exports.gives = nest('gatherings.async.publish')

exports.needs = nest({
  'sbot.async.publish': 'first'
})

exports.create = function (api) {
  return nest('gatherings.async.publish', api.sbot.async.publish)
} 
