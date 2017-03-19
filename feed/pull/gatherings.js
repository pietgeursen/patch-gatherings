const nest = require('depnest')
const pull = require('pull-stream')
const moment = require('moment')

exports.gives = nest({'feed.pull.gatherings': [
  'find',
  'hosting',
  'future'
]})

exports.needs = nest({
  'sbot.pull.messagesByType': 'first',
  'sbot.pull.links': 'first',
})

exports.create = function (api) {

  const {messagesByType, links} = api.sbot.pull 

  return nest({'feed.pull.gatherings': {
    find,
    future,
    hosting,
  }})

  function find(opts){
    var _opts = Object.assign({type: 'gathering', live: true}, opts)
    return messagesByType(_opts)
  }
  function future(opts) {
    return pull(
      find(opts), 
      pull.filter(function(gathering) {
        return moment(gathering.value.content.dateTime).isAfter(moment())
      }),
      pull.map(function(gathering) {
        return Object.assign({}, gathering.value.content, {author: gathering.value.author, id: gathering.key})
      })        
    )
  }
  function hosting(opts){
    return pull(find(opts), pull.filter(function(gathering) {
      return gathering.value.author === sbot.id 
    })) 
  }
  function linksToGathering(gatheringId, opts) {
    var _opts = Object.assign({dest: gatheringId, live: true}, opts)
    return pull(
      links(_opts), 
      pull.asyncMap(function(data, cb) {
        sbot.get(data.key, cb)
      }))
  }
  function commentsOnGathering(gatheringId, opts){
    return pull(
      linksToGathering(gatheringId, opts), 
      pull.filter(function(data) {
        return data.content.type == 'post' 
      }))
  }
  function rsvpsOnGathering(gatheringId, opts){
    return pull(
      linksToGathering(gatheringId, opts), 
      pull.filter(function(data) {
        return data.content.type == 'rsvp' 
      }))
  }

  function myRsvps(opts) {
    var _opts = Object.assign({type: 'rsvp', live: true}, opts)
    return pull(
      messagesByType(_opts),
      pull.filter(function(message) {
        return message.value.author == sbot.whoami().id
      }),
      pull.map(function(message) {
        return message.value.content.vote
      })
    )
  }
  
}  
