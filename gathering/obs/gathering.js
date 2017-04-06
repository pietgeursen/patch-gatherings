var nest = require('depnest')
var pull = require('pull-stream')
var sort = require('ssb-sort')
var Notify = require('pull-notify')
var ref = require('ssb-ref')
var { Value, Array, Set, Dict, computed, Struct } = require('mutant')

exports.needs = nest({
  'sbot.pull.links': 'first',
  'sbot.async.get': 'first'
})

exports.gives = nest('gathering.obs.gathering')

exports.create = function (api) {
  return nest('gathering.obs.gathering', function (gatheringId) {
    if (!ref.isLink(gatheringId)) throw new Error('an id must be specified')
    const subscription = subscribeToLinks(gatheringId)
    const gathering = Struct({
      title: Value(''),
      description: Value(''),
      contributors: Set(),
      startDate: Value({}),
      endDate: Value({}),
      location: Value(''),
      hosts: Dict({}),
      attendees: Array([]),
      images: Array([]),
    })
    

    pull(
      subsribeToLinksByKey(subscription, 'location'),
      pull.drain(gathering.location.set)
    )
    pull(
      subsribeToLinksByKey(subscription, 'endDate'),
      pull.drain(gathering.endDate.set)
    )
    pull(
      subsribeToLinksByKey(subscription, 'startDate'),
      pull.drain(gathering.startDate.set)
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
      pull.filter(msg => msg && msg.content && msg.content && msg.content.host),
      pull.drain(msg => {
        const host = msg.content.host
        host.remove ? gathering.hosts.delete(host.id) : gathering.hosts.put(host.id, true)
      })
    )
    pull(
      subscription(),
      pull.filter(msg => msg && msg.content && msg.content && msg.content.attendees),
      pull.drain(msg => {
        const attendees = msg.content.attendees
        attendees.remove ? gathering.attendees.delete(attendee.id) : gathering.attendees.put(attendee.id, true)
      })
    )
    pull(
      subscription(),
      pull.filter(msg => msg && msg.content && msg.content && msg.content.images),
      pull.drain(msg => {
        const images = msg.content.images
        images.remove ? gathering.images.delete(images.id) : gathering.images.put(images.id, true)
      })
    )
    return gathering
  })

  function subsribeToLinksByKey(subscription, key) {
    return pull(
      subscription(),
      pull.filter(link => {
        return link.content[key]
      }),
      pull.map(link => link.content[key])
    )
  }
  function subscribeToLinks(id) {
    const notify = Notify()
    pull(
      api.sbot.pull.links({dest: id, live: true}),
      pull.filter(data => data.key),
      pull.asyncMap(function(data, cb) {
        api.sbot.async.get(data.key, cb)
      }),
      pull.drain(notify)
    )
    return notify.listen
  }
}

