const nest = require('depnest')
const pull = require('pull-stream')
const moment = require('moment')

exports.gives = nest('gathering.pull.find')

exports.needs = nest({
  'sbot.pull.messagesByType': 'first',
  'sbot.pull.links': 'first',
  'sbot.async.get': 'first',
})

exports.create = function (api) {

  const {messagesByType, links} = api.sbot.pull 

  return nest({'gathering.pull.find': find})

  function find(opts){
    var _opts = Object.assign({},{live: true, future: true, past: false}, opts, {type: 'gathering'})
    return pull(
      messagesByType(_opts),
      pull.filter(gathering => gathering)
    )
  }

}

