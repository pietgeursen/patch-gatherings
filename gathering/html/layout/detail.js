const nest = require('depnest')
const { h, when, computed } = require('mutant')

exports.needs = nest({
  'about.html.link': 'first',
  'blob.sync.url': 'first',
  'gathering.async': {
    'attendees': 'first'
  },
  'gathering.obs.struct': 'first',
  'keys.sync.load': 'first',
  'message.html': {
    'markdown': 'first'
  },
  'gathering.html': {
    'title': 'first',
    'description': 'first',
    'images': 'first',
    'location': 'first',
    'attendees': 'first',
    'startDateTime': 'first'
  }

})

exports.gives = nest('gathering.html.layout')

exports.create = (api) => {
  return nest('gathering.html.layout', gatheringLayout)

  function gatheringLayout (msg, opts) {
    if (!(opts.layout === undefined || opts.layout === 'detail')) return

    const { obs, isEditing, isCard } = opts

    const { attendees, title, images, description, startDateTime } = api.gathering.html
    const editedGathering = api.gathering.obs.struct()

    const myKey = '@' + api.keys.sync.load().public

    const isAttending = computed(obs.attendees, attendees => attendees.includes(myKey))
    const handleAttend = () => {
      if (isAttending()) return
      api.gathering.async.attendees({ attendees: [{ id: myKey }], gathering: msg.key }, console.log)
    }
    const handleUnAttend = () => {
      if (!isAttending()) return
      api.gathering.async.attendees({ attendees: [{ id: myKey, remove: true }], gathering: msg.key }, console.log) 
    }

    return h('Message -gathering-detail', [
      h('.toggle-layout', {
        'ev-click': e => {
          e.preventDefault()
          isCard.set(true)
        }
      }, '-'),
     title({ title: obs.title, msg, isEditing, onUpdate: editedGathering.title.set }),
      h('section.content', [
        images({images: obs.images, msg, isEditing, onUpdate: editedGathering.images.add}),
        h('section.description', description({description: obs.description, msg, isEditing, onUpdate: editedGathering.description.set})),
        h('section.time', startDateTime({startDateTime: obs.startDateTime, msg, isEditing, onUpdate: editedGathering.startDateTime.set})),
        h('section.attendees', [
          h('header', 'Attendees'),
          h('div.people', attendees({ attendees: obs.attendees, msg }))
        ])
      ]),
      h('section.actions', [
        h('button.attend', { 'ev-click': handleAttend }, 'Attend'),
        h('button.not-going', { 'ev-click': handleUnAttend }, 'Not going'),
        h('button.edit', { 'ev-click': () => isEditing.set(!isEditing()) }, when(isEditing, 'Cancel', 'Edit')),
        when(isEditing, h('button', {'ev-click': () => save({obs: editedGathering, id: msg.key})}, 'Update'))
      ])
    ])

    function save ({obs, id}) {
      obs.save(id)
      isEditing.set(false)
    }
  }
}
