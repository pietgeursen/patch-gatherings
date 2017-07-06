const spacetime = require('spacetime')
const nest = require('depnest')
const pull = require('pull-stream')
const Notify = require('pull-notify')
const ref = require('ssb-ref')
const { computed } = require('mutant')

exports.needs = nest({
  'about.obs.latestValue': 'first',
  'about.obs.groupedValues': 'first',
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

    const { latestValue, groupedValues } = api.about.obs

    const imgBlob = (img) => img && img.link ? img.link : img

    const gathering = api.gathering.obs.struct({
      description: latestValue(gatheringId, 'description'),
      title: latestValue(gatheringId, 'title'),
      location: latestValue(gatheringId, 'location'),
      endDateTime: latestValue(gatheringId, 'endDateTime'),
      attendees: computed([groupedValues(gatheringId, 'attendee')], Object.keys),
      images: computed([groupedValues(gatheringId, 'image')], Object.keys),
      thumbnail: computed(latestValue(gatheringId, 'image'), img => blobToUrl(imgBlob(img)))
    })

    pull(
      subsribeToLinksByKey(subscription, 'startDateTime'),
      pull.map(st => {
        try {
          return spacetime(st)
        } catch (e) {
        }
      }),
      pull.drain(gathering.startDateTime.set)
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
