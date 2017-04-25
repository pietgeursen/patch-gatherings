const nest = require('depnest')
const { h, Value, computed, map, when } = require('mutant')
const { isMsg } = require('ssb-ref')

exports.needs = nest({
  'about.html.link': 'first',
  'blob.sync.url': 'first',
  'gathering.async.attendees': 'first',
  'keys.sync.load': 'first',
  'message.html': {
    markdown: 'first'
  },
  'gathering.html': {
    'title': 'first',
    'images': 'first',
    'location': 'first',
    'attendees': 'first',
  }

})

exports.gives = nest('gathering.html.layout')

exports.create = (api) => {
  return nest('gathering.html.layout', gatheringLayout)

  function gatheringLayout (msg, opts) {
    if (!(opts.layout === undefined || opts.layout === 'default')) return

    const { layout, obs, isEditing, isSummary } = opts

    const { title, images, location, attendees } = api.gathering.html
    const myKey = '@' + api.keys.sync.load().public

    return h('Message', {attributes: {tabindex:'0'}}, [
      h('button', {'ev-click': () => isSummary.set(false) }, 'More...'),
      h('section.content', [
        title({obs, msg}),
        images({obs, msg}),
        location({obs, msg}),
        attendees({obs, msg}),
        h('section.time', {}, [
          h('h3', 'When:'),
          h('div', ['starts: ', obs.startDate]),
          h('div', ['ends: ', obs.endDate]),
        ]), 
        h('button', {'ev-click': () => api.gathering.async.attendees({attendees: [{id: myKey }], id: msg.key}, console.log)}, 'Attend' ),
        h('button', {'ev-click': () => api.gathering.async.attendees({attendees: [{id: myKey, remove: true }], id: msg.key}, console.log)}, 'Not going' ),
        h('button', {'ev-click': () => isEditing.set(!isEditing()) }, when(isEditing, 'Cancel', 'Edit'))
      ])
    ])
  }
}
