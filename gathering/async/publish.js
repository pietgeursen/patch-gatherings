const nest = require('depnest')

exports.gives = nest('gathering.async.publish')

exports.needs = nest({
  'sbot.async.publish': 'first'
})

exports.create = function (api) {
  return nest('gathering.async.publish', api.sbot.async.publish)
} 
