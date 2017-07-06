const nest = require('depnest')
const pull = require('pull-stream')

exports.gives = nest({
  'tests': true,
  'blob.sync.url': true
})

exports.needs = nest({
  'gathering.async.create': 'first',
  'gathering.async.title': 'first',
  'gathering.async.attendees': 'first',
  'gathering.obs.gathering': 'first',
  'gathering.pull.find': 'first',
  'sbot.close': 'first',
  'sbot.whoami': 'first',
  'sbot.create': 'first'
})

exports.create = function (api) {
  return nest({
    'tests': tests,
    'blob.sync.url': url => url
  })

  function tests (tests) {
    tests['obs.gathering is requireable'] = function (assert, cb) {
      assert(api.gathering.obs.gathering)
      cb()
    }
    tests['obs.gathering attendees obs updates when a attendee of a gathering is added '] = function (assert, cb) {
      api.sbot.create()
      const attendeeId = api.sbot.whoami().id
      api.gathering.async.create({}, function (err) { assert(!err) })
      pull(
        api.gathering.pull.find({past: true, future: true}),
        pull.map(gathering => api.gathering.obs.gathering(gathering.key)),
        pull.drain(gathering => {
          gathering(val => {
            assert(val.attendees.includes(attendeeId))
            api.sbot.close()
            cb()
          })
        })
      )
      pull(
        api.gathering.pull.find({past: true, future: true}),
        pull.asyncMap((gathering, cb) => {
          api.gathering.async.attendees({attendees: [{id: attendeeId}], gathering: gathering.key}, cb)
        }),
        pull.drain(attendee => {
        })
      )
    }
    tests['obs.gathering attendees obs updates when a attendee of a gathering is removed '] = function (assert, cb) {
      api.sbot.create()
      const attendeeId = api.sbot.whoami().id
      api.gathering.async.create({}, function (err) { assert(!err) })
      pull(
        api.gathering.pull.find({past: true, future: true}),
        pull.map(gathering => api.gathering.obs.gathering(gathering.key)),
        pull.drain(gathering => {
          gathering.attendees.add(attendeeId)
          gathering(val => {
            assert(!val.attendees.includes(attendeeId))
            api.sbot.close()
            cb()
          })
        })
      )
      pull(
        api.gathering.pull.find({past: true, future: true}),
        pull.asyncMap((gathering, cb) => {
          api.gathering.async.attendees({attendees: [{id: attendeeId, remove: true}], gathering: gathering.key}, cb)
        }),
        pull.drain(attendee => {
        })
      )
    }
    tests['obs.gathering title obs updates when a title of a gathering is published'] = function (assert, cb) {
      const title = 'meow!'
      api.sbot.create()
      api.gathering.async.create({}, function (err) { assert(!err) })
      pull(
        api.gathering.pull.find({past: true, future: true}),
        pull.map(gathering => api.gathering.obs.gathering(gathering.key)),
        pull.drain(gathering => {
          gathering(val => {
            assert(val.title === title)
            api.sbot.close()
            cb()
          })
        })
      )
      pull(
        api.gathering.pull.find({past: true, future: true}),
        pull.asyncMap((gathering, cb) => {
          api.gathering.async.title({title, gathering: gathering.key}, cb)
        }),
        pull.drain(title => {
        })
      )
    }
    return tests
  }
}
