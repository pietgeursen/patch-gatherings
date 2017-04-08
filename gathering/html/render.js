var h = require('mutant/h')
var map = require('mutant/map')
var nest = require('depnest')
var extend = require('xtend')

exports.needs = nest({
  'gathering.obs.gathering': 'first',
  'gathering.async.attendees': 'first',
  'feed.html.render':'first',
  'keys.sync.load': 'first',
  'message.html': {
    decorate: 'reduce',
    layout: 'first',
    link: 'first',
    markdown: 'first'
  }
})

exports.gives = nest('gathering.html.render')

exports.create = function (api) {
  return nest('gathering.html.render', function renderGathering (msg, opts) {
    if (!msg.value || (msg.value.content.type !== 'gathering')) return
    obs = api.gathering.obs.gathering(msg.key) 
    const element = api.message.html.layout(msg, extend({
      title: messageTitle(obs),
      content: messageContent(obs, msg),
      layout: 'default'
    }, opts))

    return api.message.html.decorate(element, { msg })
  })

  function messageContent (obs, msg) {
    const myKey = api.keys.sync.load().public
    obs.attendees(console.log)
    return h('div', [
      h('div', {}, obs.description),
      h('div', {}, obs.attendees),
      h('button', {'ev-click': () => api.gathering.async.attendees({attendees: [{id: myKey }], id: msg.key}, console.log)}, 'Attend' ),
      h('button', {'ev-click': () => api.gathering.async.attendees({attendees: [{id: myKey, remove: true }], id: msg.key}, console.log)}, 'Not going' )
    ])
  }

  function messageTitle (obs) {
    return h('span', {}, obs.title)
  }
}
