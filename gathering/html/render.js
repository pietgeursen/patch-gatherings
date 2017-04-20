var h = require('mutant/h')
var map = require('mutant/map')
var Value = require('mutant/value')
var when = require('mutant/when')
var computed = require('mutant/computed')
var nest = require('depnest')
var extend = require('xtend')

exports.needs = nest({
  'gathering.obs.gathering': 'first',
  'gathering.html.edit': 'first',
  'gathering.async.attendees': 'first',
  'feed.html.render':'first',
  'keys.sync.load': 'first',
  'about.html.link': 'first',
  'message.html': {
    decorate: 'reduce',
    layout: 'first',
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
    obs = api.gathering.obs.gathering(msg.key) 
    const element = api.message.html.layout(msg, extend({
      title: messageTitle(obs, msg),
      content: when(isEditing, api.gathering.html.edit(obs, msg, isEditing), messageContent(obs, msg, isEditing)),
      layout: 'default'
    }, opts))

    return api.message.html.decorate(element, { msg })
  }
  function messageContent (obs, msg, isEditing) {
    const myKey = '@' + api.keys.sync.load().public
    const prettyDescription = computed(obs.description, api.message.html.markdown )
    const prettyLocation = computed(obs.location, api.message.html.markdown )
    const linkedAttendees = computed(obs.attendees, (attendees) => attendees.map(api.about.html.link))
    return h('div', [
      h('section.description', {}, [
        h('h3', 'What:'),
        h('div', prettyDescription),

      ]),
      h('section.location', {}, [
        h('h3', 'Where:'),
        h('div', obs.prettyLocation),

      ]),
      h('section.time', {}, [
        h('h3', 'When:'),
        h('div', ['starts: ', obs.startDate]),
        h('div', ['ends: ', obs.endDate]),
      ]),
      h('section.hosts', {}, [
        h('h3', 'Hosted by:'),
        h('div', obs.hosts),
      ]),
      h('section.attendees', {}, [
        h('h3', 'Going:'),
        h('div', linkedAttendees),
      ]),
      h('div', {}, obs.contributors),
      h('button', {'ev-click': () => api.gathering.async.attendees({attendees: [{id: myKey }], id: msg.key}, console.log)}, 'Attend' ),
      h('button', {'ev-click': () => api.gathering.async.attendees({attendees: [{id: myKey, remove: true }], id: msg.key}, console.log)}, 'Not going' ),
      h('button', {'ev-click': () => isEditing.set(!isEditing()) }, when(isEditing, 'Cance', 'Edit'))
    ])
  }

  function messageTitle (obs, msg) {
    const prettyTitle = computed(obs.title, api.message.html.markdown )
    return h('a', {href: msg.key}, prettyTitle)
  }
}
