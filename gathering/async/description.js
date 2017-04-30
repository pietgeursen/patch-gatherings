const nest = require('depnest')

exports.gives = nest('gathering.async.description')

exports.needs = nest({
  'sbot.async.publish': 'first'
})

exports.create = function (api) {
  return nest('gathering.async.description', function ({description, gathering}, cb) {
    api.sbot.async.publish({type: 'about', link: gathering, description}, cb)
  })
}
