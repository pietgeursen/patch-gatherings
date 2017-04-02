const nest = require('depnest')
const pull = require('pull-stream')
const async = require('pull-async')

exports.gives = nest('tests')

exports.needs = nest({
  'async.create': 'first',
  'async.title': 'first',
  'async.hosts': 'first',
  'obs.gathering': 'first',
  'pull.find': 'first',
  'sbot.close': 'first',
  'sbot.create': 'first'
})

exports.create = function (api) {

  return nest('tests', tests)

  function tests(tests) {
    tests['obs.gathering is requireable'] = function(assert, cb) {
      assert(api.obs.gathering) 
      cb()
    }
    tests['obs.gathering hosts obs updates when a host of a gathering is added '] = function(assert, cb) {
      const hostId = '123dfj'
      api.sbot.create()
      api.async.create({}, function(err) {})
      pull(
        api.pull.find(),
        pull.map(gathering => api.obs.gathering(gathering.key)),
        pull.drain(gathering => {
          gathering(val => {
            assert(val.hosts[hostId]) 
            api.sbot.close()
            cb()
          })
        })
      )
      pull(
        api.pull.find(),
        pull.asyncMap((gathering, cb) => {
          api.async.hosts({hosts: [{id: hostId}], id: gathering.key}, cb)
        }),
        pull.drain(host => {
        })
      )
    }
    tests['obs.gathering hosts obs updates when a host of a gathering is removed '] = function(assert, cb) {
      const hostId = '123dfj'
      api.sbot.create()
      api.async.create({}, function(err) {})
      pull(
        api.pull.find(),
        pull.map(gathering => api.obs.gathering(gathering.key)),
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
        api.pull.find(),
        pull.asyncMap((gathering, cb) => {
          api.async.hosts({hosts: [{id: hostId, remove: true}], id: gathering.key}, cb)
        }),
        pull.drain(host => {
        })
      )
    }
    tests['obs.gathering title obs updates when a title of a gathering is published'] = function(assert, cb) {
      const title = 'meow!'
      api.sbot.create()
      api.async.create({}, function(err) {})
      pull(
        api.pull.find(),
        pull.map(gathering => api.obs.gathering(gathering.key)),
        pull.drain(gathering => {
          gathering(val => {
            assert(val.title === title) 
            api.sbot.close()
            cb()
          })
        })
      )
      pull(
        api.pull.find(),
        pull.asyncMap((gathering, cb) => {
          api.async.title({title, id: gathering.key}, cb)
        }),
        pull.drain(title => {
        })
      )
    }
    return tests
  }  
}

