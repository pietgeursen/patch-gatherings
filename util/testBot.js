var ssbKeys = require('ssb-keys')
var createSbot = require('scuttlebot')
var nest = require('depnest')

exports.gives = nest({
  'sbot': ['close','create'],
  'sbot.async': ['publish'],
  'sbot.pull': [
    'messagesByType',
    'links',
  ],
})

exports.create = function (api) {
  var sbot;
  return nest({
    'sbot':{ 
      create: function() {
        sbot = createSbot({keys: ssbKeys.generate(), temp: Math.random().toString()})
      },
      close: function() {
        sbot.close()
      },
      'async.publish': function(content, cb) {
        sbot.publish(content, cb)
      },
      pull: {
        messagesByType: function(opts) {
          return sbot.messagesByType(opts)  
        },
        links: function() {
          return sbot.links
        } 
      }
    },
  })
}
 
