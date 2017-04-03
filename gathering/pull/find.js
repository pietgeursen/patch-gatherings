const nest = require('depnest')
const pull = require('pull-stream')
const moment = require('moment')

exports.gives = nest('pull.find')

exports.needs = nest({
  'sbot.pull.messagesByType': 'first',
  'sbot.pull.links': 'first',
  'sbot.async.get': 'first',
})

exports.create = function (api) {

  const {messagesByType, links} = api.sbot.pull 

  return nest({'pull.find': find})

  function find(opts){
    var _opts = Object.assign({},{live: true, future: true, past: false}, opts, {type: 'gathering'})
    return pull(
      messagesByType(_opts),
      pull.asyncMap((gathering, cb) => {
        if(_opts.future && _opts.past){ 
          return cb(null, gathering)
        }
        if(_opts.future){
          isFuture(gathering.key, function(err, res) {
            if(err) return cb(err)
            res ? cb(null, gathering) : cb(null, null)
          }) 
        }
        if(_opts.past){
          isFuture(gathering.key, function(err, res) {
            if(err) return cb(err)
            !res ? cb(null, gathering) : cb(null, null)
          }) 
        }
      }),
      pull.filter(gathering => gathering)
    )
  }

  function isFuture(gatheringId, cb) {
    return pull(
      api.sbot.pull.links({dest: gatheringId, live: false}),
      pull.filter(gathering => gathering.key),
      pull.asyncMap(function(data, cb) {
        api.sbot.async.get(data.key, cb)
      }),
      pull.collect((err, data) => {
        //assume the last date emitted will be the latest update which might not be true 
        const latest = data[data.length -1]
        cb(null, moment(latest.content.startDateTime).isAfter(moment()))
      })
    )
  }
}

