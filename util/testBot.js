var ssbKeys = require('ssb-keys')
var createSbot = require('scuttlebot')
var nest = require('depnest')

exports.gives = nest({
  'sbot': ['close'],
  'sbot.async': ['publish'],
  'sbot.pull': [
    'messagesByType',
    'links',
  ],
})

exports.create = function (api) {
  const sbot = createSbot({keys: ssbKeys.generate(), temp: Math.random().toString()})
  return nest({
    'sbot.pull': {
      messagesByType: sbot.messagesByType,
      links: sbot.links,
    },
    'sbot.close': sbot.close,
    'sbot.async.publish': sbot.publish
  })
}
 
