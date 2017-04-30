const ssbKeys = require('ssb-keys')
const createSbot = require('scuttlebot')
const nest = require('depnest')

exports.gives = nest({
  'sbot': ['close','create', 'whoami'],
  'sbot.async': ['publish', 'get'],
  'sbot.pull': [
    'messagesByType',
    'links',
  ],
})

exports.create = function (api) {
  var sbot;
  return nest({
    'sbot':{ 
      create: function(name = Math.random().toString()) {
        sbot = createSbot({keys: ssbKeys.generate(), temp: name })
      },
      close: function() {
        sbot.close()
      },
      whoami: function() {
        return sbot.whoami()
      },
      'async.get': function(id, cb) {
        sbot.get(id, cb)
      },
      'async.publish': function(content, cb) {
        sbot.publish(content, cb)
      },
      pull: {
        messagesByType: function(opts) {
          return sbot.messagesByType(opts)  
        },
        links: function(opts) {
          return sbot.links(opts)
        } 
      }
    },
  })
}
 
