const nest = require('depnest')
const { h, computed, when } = require('mutant')

exports.needs = nest({
  'blob.sync.url': 'first'
})

exports.gives = nest(
  'gathering.html.title'
)

exports.create = (api) => {
  return nest('gathering.html.title', title)
  function title ({title, msg, isEditing, onUpdate}) {

    return h('section.title',
      when(isEditing,
        h('input', {'ev-input': e => onUpdate(e.target.value), value: title}),
        h('a', {href: msg.key}, title)
      )
    )
  }
}
