const spacetime = require('spacetime')
const nest = require('depnest')
const pull = require('pull-stream')
const Notify = require('pull-notify')
const ref = require('ssb-ref')

exports.needs = nest({
  'sbot.pull.links': 'first',
  'sbot.async.get': 'first',
  'gathering.obs.struct': 'first',
  'blob.sync.url': 'first'
})

exports.gives = nest('gathering.obs.gathering')

exports.create = function (api) {
  return nest('gathering.obs.gathering', function (gatheringId) {
    if (!ref.isLink(gatheringId)) throw new Error('an id must be specified')

    const subscription = subscribeToLinks(gatheringId)
    const blobToUrl = api.blob.sync.url

    const gathering = api.gathering.obs.struct()
    gathering.title.set(gatheringId.substring(0, 10)+'...')

    pull(
      subsribeToLinksByKey(subscription, 'location'),
      pull.drain(gathering.location.set)
    )
    pull(
      subsribeToLinksByKey(subscription, 'endDateTime'),
      pull.drain(gathering.endDateTime.set)
    )
    pull(
      subsribeToLinksByKey(subscription, 'startDateTime'),
      pull.map(spacetime),
      pull.drain(gathering.startDateTime.set)
    )
    pull(
      subsribeToLinksByKey(subscription, 'title'),
      pull.drain(gathering.title.set)
    )
    pull(
      subsribeToLinksByKey(subscription, 'description'),
      pull.drain(gathering.description.set)
    )
    pull(
      subscription(),
      pull.filter(msg => msg.content.attendee),
      pull.drain((msg) => {
        const attendee = msg.content.attendee
        attendee.remove ? gathering.attendees.delete(attendee.link) : gathering.attendees.add(attendee.link)
      })
    )
    pull(
      subscription(),
      pull.filter(msg => msg.content.image),
      pull.drain((msg) => {
        const image = msg.content.image
        image.remove ? gathering.images.delete(image.link) : gathering.images.add(image.link)
      })
    )
    pull(
      subscription(),
      pull.filter(msg => msg.content.image),
      pull.filter(msg => !msg.content.image.remove),
      pull.map(msg => msg.content.image.link),
      pull.map(blobToUrl),
      pull.drain((url) => {
        gathering.thumbnail.set(url)
      })
    )
    return gathering
  })

  function subsribeToLinksByKey (subscription, key) {
    var timestamp = 0
    return pull(
      subscription(),
      pull.filter(link => {
        return link.content[key]
      }),
      pull.filter(link => {
        if (link.timestamp > timestamp) {
          timestamp = link.timestamp
          return true
        }
        return false
      }),
      pull.map(link => link.content[key])
    )
  }
  function subscribeToLinks (id) {
    const notify = Notify()
    pull(
      api.sbot.pull.links({dest: id, live: true}),
      pull.filter(data => data.key),
      pull.asyncMap(function (data, cb) {
        api.sbot.async.get(data.key, cb)
      }),
      pull.drain(notify)
    )
    return notify.listen
  }
}
