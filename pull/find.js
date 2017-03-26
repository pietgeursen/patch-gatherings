const nest = require('depnest')
const pull = require('pull-stream')
const moment = require('moment')

exports.gives = nest({'pull': [
  'find',
]})

exports.needs = nest({
  'sbot.pull.messagesByType': 'first',
  'sbot.pull.links': 'first',
})

exports.create = function (api) {

  const {messagesByType, links} = api.sbot.pull 

  return nest({'pull': {
    find,
  }})

  function find(opts){
    var _opts = Object.assign({type: 'gathering', live: true}, opts)
    return messagesByType(_opts)
  }
}

