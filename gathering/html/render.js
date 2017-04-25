var h = require('mutant/h')
var map = require('mutant/map')
var Value = require('mutant/value')
var when = require('mutant/when')
var computed = require('mutant/computed')
var nest = require('depnest')

exports.needs = nest({
  'blob.sync.url': 'first',
  'gathering.obs.gathering': 'first',
  'gathering.html.edit': 'first',
  'gathering.html.layout': 'first',
  'gathering.async.attendees': 'first',
  'feed.html.render':'first',
  'keys.sync.load': 'first',
  'about.html.link': 'first',
  'message.html': {
    decorate: 'reduce',
    link: 'first',
    markdown: 'first'
  }
})

exports.gives = nest({
  'message.html': ['render'],
  'gathering.html': ['render']
})

exports.create = function (api) {
  return nest({
    'message.html.render': renderGathering,
    'gathering.html.render': renderGathering
  })
  function renderGathering (msg, opts) {
    if (!msg.value || (msg.value.content.type !== 'gathering')) return
    const isEditing = Value(false) 
    const isSummary = Value(true) 
    obs = api.gathering.obs.gathering(msg.key) 

    const element = h('Message', {attributes: {tabindex:'0'}}, computed([isSummary], (summary) => {
      const layout = summary ? 'summary' : 'default'

      return api.gathering.html.layout(msg, {layout, isEditing, isSummary, obs})
    }))

    return api.message.html.decorate(element, { msg })
  }
  function messageContent (obs, msg, isEditing) {
    const myKey = '@' + api.keys.sync.load().public

    return h('div', [
      h('section.time', {}, [
        h('h3', 'When:'),
        h('div', ['starts: ', obs.startDate]),
        h('div', ['ends: ', obs.endDate]),
      ]),
      h('button', {'ev-click': () => api.gathering.async.attendees({attendees: [{id: myKey }], id: msg.key}, console.log)}, 'Attend' ),
      h('button', {'ev-click': () => api.gathering.async.attendees({attendees: [{id: myKey, remove: true }], id: msg.key}, console.log)}, 'Not going' ),
      h('button', {'ev-click': () => isEditing.set(!isEditing()) }, when(isEditing, 'Cancel', 'Edit'))
    ])
  }

}
