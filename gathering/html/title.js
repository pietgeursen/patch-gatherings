const nest = require('depnest')
const { h, when, computed } = require('mutant')

exports.needs = nest({
  'blob.sync.url': 'first'
})

exports.gives = nest(
  'gathering.html.title'
)

exports.create = (api) => {
  return nest('gathering.html.title', title)
  function title ({title, msg, isEditing, onUpdate}) {
    title = computed(title, t => t || 'unnamed gathering')

    return h('section.title',
      when(isEditing,
        h('input', {'ev-input': e => onUpdate(e.target.value), value: title}),
        h('a', {href: msg.key}, title)
      )
    )
  }
}
