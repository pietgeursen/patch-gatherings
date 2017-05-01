const nest = require('depnest')

exports.gives = nest('gathering.async.title')

exports.needs = nest({
  'sbot.async.publish': 'first'
})

exports.create = function (api) {
  return nest('gathering.async.title', function ({title, gathering}, cb) {
    api.sbot.async.publish({type: 'about', about: gathering, title}, cb)
  })
}
