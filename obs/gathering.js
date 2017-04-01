var nest = require('depnest')
var pull = require('pull-stream')
var pullCat = require('pull-cat')
var sort = require('ssb-sort')
var ref = require('ssb-ref')
var { Value, Set, map, computed, Struct } = require('mutant')

exports.needs = nest({
  'sbot.pull.links': 'first',
  'sbot.async.get': 'first'
})

exports.gives = nest('obs.gathering')

exports.create = function (api) {
  return nest('obs.gathering', function (gatheringId) {
    if (!ref.isLink(gatheringId)) throw new Error('an id must be specified')
    const titleObs = Value('')
    pull(
      api.sbot.pull.links({dest: gatheringId, live: true}),
      pull.filter(data => data.key),
      pull.asyncMap(function(data, cb) {
        api.sbot.async.get(data.key, cb)
      }),
      pull.filter(link => {
        return link.content.title
      }),
      pull.map(link => link.content.title),
      pull.drain(titleObs.set)
    )

    return Struct({
      title: titleObs
    })
  })
}

