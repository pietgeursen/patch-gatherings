var ssbKeys = require('ssb-keys')
var createSbot = require('scuttlebot')
var nest = require('depnest')

exports.gives = nest({
  'sbot': ['close','create'],
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
 
