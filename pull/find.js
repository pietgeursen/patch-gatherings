const nest = require('depnest')
const pull = require('pull-stream')
const moment = require('moment')

exports.gives = nest({'pull': [
  'find',
]})

exports.needs = nest({
  'sbot.pull.messagesByType': 'first',
  'sbot.pull.links': 'first',
  'sbot.async.get': 'first',
})

exports.create = function (api) {

  const {messagesByType, links} = api.sbot.pull 

  return nest({'pull': {
    find,
  }})

  function find(opts){
    var _opts = Object.assign({type: 'gathering', live: true}, opts)
    return pull(
      messagesByType(_opts),
      pull.filter(gatherings => {
        if(opts.future){
        
        }  
      })
    )
  }

  function isFuture(gatheringId, cb) {
    return pull(
      api.sbot.pull.links({dest: id, live: false}),
      pull.filter(data => data.startDateTime),
      pull.asyncMap(function(data, cb) {
        api.sbot.async.get(data.startDateTime, cb)
      }),
      pull.collect((err, data) => {
        //assume the last date emitted will be the latest update which might not be true 
        console.log(data)
        const latest = data[data.length -1]
      })
    )
  }
}

