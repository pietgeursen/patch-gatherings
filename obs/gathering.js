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

exports.gives = nest('obs.gathering')

exports.create = function (api) {
  return nest('obs.gathering', function (gatheringId) {
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
        host.isHosting ? gathering.hosts.put(host.id, true) : gathering.hosts.delete(host.id)
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

