const nest = require('depnest')
const spacetime = require('spacetime')

exports.gives = nest('gathering.async.startDateTime')

exports.needs = nest({
  'sbot.async.publish': 'first'
})

exports.create = function (api) {
  return nest('gathering.async.startDateTime', function ({startDateTime, gathering}, cb) {
    api.sbot.async.publish({type: 'about', link: gathering, startDateTime: spacetime(startDateTime)}, cb)
  })
}
