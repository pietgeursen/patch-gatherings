const nest = require('depnest')
const pull = require('pull-stream')
const async = require('pull-async')

exports.gives = nest('tests')

exports.needs = nest({
  'gathering.async.create': 'first',
  'gathering.async.title': 'first',
  'gathering.async.hosts': 'first',
  'gathering.obs.gathering': 'first',
  'gathering.pull.find': 'first',
  'sbot.close': 'first',
  'sbot.create': 'first'
})

exports.create = function (api) {

  return nest('tests', tests)

  function tests(tests) {
    tests['obs.gathering is requireable'] = function(assert, cb) {
      assert(api.gathering.obs.gathering) 
      cb()
    }
    tests['obs.gathering hosts obs updates when a host of a gathering is added '] = function(assert, cb) {
      const hostId = '123dfj'
      api.sbot.create()
      api.gathering.async.create({}, function(err) {})
      pull(
        api.gathering.pull.find({past: true, future: true}),
        pull.map(gathering => api.gathering.obs.gathering(gathering.key)),
        pull.drain(gathering => {
          gathering(val => {
            assert(val.hosts[hostId]) 
            api.sbot.close()
            cb()
          })
        })
      )
      pull(
        api.gathering.pull.find({past: true, future: true}),
        pull.asyncMap((gathering, cb) => {
          api.gathering.async.hosts({hosts: [{id: hostId}], id: gathering.key}, cb)
        }),
        pull.drain(host => {
        })
      )
    }
    tests['obs.gathering hosts obs updates when a host of a gathering is removed '] = function(assert, cb) {
      const hostId = '123dfj'
      api.sbot.create()
      api.gathering.async.create({}, function(err) {})
      pull(
        api.gathering.pull.find({past: true, future: true}),
        pull.map(gathering => api.gathering.obs.gathering(gathering.key)),
        pull.drain(gathering => {
          gathering.hosts.put(hostId, true)
          gathering(val => {
            assert(!val.hosts[hostId]) 
            api.sbot.close()
            cb()
          })
        })
      )
      pull(
        api.gathering.pull.find({past: true, future: true}),
        pull.asyncMap((gathering, cb) => {
          api.gathering.async.hosts({hosts: [{id: hostId, remove: true}], id: gathering.key}, cb)
        }),
        pull.drain(host => {
        })
      )
    }
    tests['obs.gathering title obs updates when a title of a gathering is published'] = function(assert, cb) {
      const title = 'meow!'
      api.sbot.create()
      api.gathering.async.create({}, function(err) {})
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
          api.gathering.async.title({title, id: gathering.key}, cb)
        }),
        pull.drain(title => {
        })
      )
    }
    return tests
  }  
}

