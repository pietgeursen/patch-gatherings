const nest = require('depnest')
const pull = require('pull-stream')

exports.gives = nest('gathering.async.images')

exports.needs = nest({
  'sbot.async.publish': 'first'
})

exports.create = function (api) {
  return nest('gathering.async.images', function (data, cb) {
    pull(
      pull.values(data.images),
      pull.asyncMap((image, cb) => {
        api.sbot.async.publish({type: 'about', link: data.gathering, image: {link: image.link, remove: image.remove}}, cb)
      }),
      pull.collect(cb)
    )
  })
}
