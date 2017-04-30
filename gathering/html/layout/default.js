const nest = require('depnest')
const { h, when, forEachPair } = require('mutant')

exports.needs = nest({
  'about.html.link': 'first',
  'blob.sync.url': 'first',
  'gathering.async': {
    'title': 'first',
    'description': 'first',
    'images': 'first',
    'location': 'first',
    'attendees': 'first',
    'hosts': 'first',
    'startDateTime': 'first'
  },
  'gathering.obs.struct': 'first',
  'keys.sync.load': 'first',
  'message.html': {
    markdown: 'first'
  },
  'gathering.html': {
    'title': 'first',
    'description': 'first',
    'images': 'first',
    'location': 'first',
    'attendees': 'first',
    'hosts': 'first',
    'startDateTime': 'first'
  }

})

exports.gives = nest('gathering.html.layout')

exports.create = (api) => {
  return nest('gathering.html.layout', gatheringLayout)

  function gatheringLayout (msg, opts) {
    if (!(opts.layout === undefined || opts.layout === 'default')) return

    const { obs, isEditing, isSummary } = opts

    const { attendees, title, images, location, description, startDateTime } = api.gathering.html
    const editedGathering = api.gathering.obs.struct()

    const myKey = '@' + api.keys.sync.load().public

    return [
      h('button', { 'ev-click': () => isSummary.set(true) }, 'Less...'),
      title({ obs, msg, isEditing, value: editedGathering.title }),
      h('section.content', [
        images({obs, msg, isEditing, value: editedGathering.images}),
        location({obs, msg, isEditing, value: editedGathering.location}),
        description({obs, msg, isEditing, value: editedGathering.description}),
        attendees({ obs, msg }),
        startDateTime({obs, msg, isEditing, value: editedGathering.startDateTime}),
        h('section.actions', [
          h('button', { 'ev-click': () => api.gathering.async.attendees({ attendees: [{ id: myKey }], gathering: msg.key }, console.log) }, 'Attend'),
          h('button', { 'ev-click': () => api.gathering.async.attendees({ attendees: [{ id: myKey, remove: true }], gathering: msg.key }, console.log) }, 'Not going'),
          h('button', { 'ev-click': () => isEditing.set(!isEditing()) }, when(isEditing, 'Cancel', 'Edit')),
          when(isEditing, h('button', {'ev-click': save}, 'Update'))
        ])
      ])
    ]

    function save () {
      forEachPair(editedGathering, (k, v) => {
        if (api.gathering.async[k] && v) {
          api.gathering.async[k]({[k]: v, gathering: msg.key}, console.log)
        }
      })
      isEditing.set(false)
    }
  }
}
