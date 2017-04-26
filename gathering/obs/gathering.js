var nest = require('depnest')
var pull = require('pull-stream')
var cat = require('pull-cat')
var sort = require('ssb-sort')
var Notify = require('pull-notify')
var ref = require('ssb-ref')
var { Value, Array, Set, Dict, computed, Struct } = require('mutant')

exports.needs = nest({
  'sbot.pull.links': 'first',
  'sbot.async.get': 'first',
})

exports.gives = nest('gathering.obs.gathering')

exports.create = function (api) {
  return nest('gathering.obs.gathering', function (gatheringId) {
    if (!ref.isLink(gatheringId)) throw new Error('an id must be specified')
    const subscription = subscribeToLinks(gatheringId)
    const gathering = Struct({
      title: Value(''),
      description: Value(''),
      thumbnail: Value(''),
      startDate: Value(''),
      endDate: Value(''),
      location: Value(''),
      contributors: Set([]),
      hosts: Set([]),
      attendees: Set([]),
      images: Set([])
    })
    
    pull(
      subsribeToLinksByKey(subscription, 'location'),
      pull.drain(gathering.location.set)
    )
    pull(
      subsribeToLinksByKey(subscription, 'location'),
      pull.drain(gathering.thumbnail.set)
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
      cat([pull.once(gatheringId), subsribeToLinksByKey(subscription, 'title')]),
      pull.drain(gathering.title.set)
    )
    pull(
      subsribeToLinksByKey(subscription, 'description'),
      pull.drain(gathering.description.set)
    )
    pull(
      api.sbot.pull.links({dest: '@', rel: 'host', live: true}),
      pull.filter(data => data.key),
      pull.asyncMap(function(data, cb) {
        api.sbot.async.get(data.key, cb)
      }),
      pull.drain(msg => {
        const host = msg.content.host
        host.remove ? gathering.hosts.delete(host.link) : gathering.hosts.add(host.link)
      })
    )
    pull(
      api.sbot.pull.links({dest: '@', rel: 'attendee', live: true}),
      pull.filter(data => data.key),
      pull.asyncMap(function(data, cb) {
        api.sbot.async.get(data.key, cb)
      }),
      pull.drain(msg => {
        const attendee = msg.content.attendee
        attendee.remove ? gathering.attendees.delete(attendee.link) : gathering.attendees.add(attendee.link)
      })
    )
    pull(
      api.sbot.pull.links({dest: '@', rel: 'image', live: true}),
      pull.filter(data => data.key),
      pull.asyncMap(function(data, cb) {
        api.sbot.async.get(data.key, cb)
      }),
      pull.drain(msg => {
        const image = msg.content.image
        image.remove ? gathering.images.delete(image.link) : gathering.images.add(image.link)
      })
    )
    pull(
      api.sbot.pull.links({dest: '@', rel: 'contibutor', live: true}),
      pull.filter(data => data.key),
      pull.asyncMap(function(data, cb) {
        api.sbot.async.get(data.key, cb)
      }),
      pull.drain(msg => {
        const contibutor = msg.content.contibutor
        contibutor.remove ? gathering.contributors.delete(contibutor.link) : gathering.contributors.add(contibutor.link)
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

