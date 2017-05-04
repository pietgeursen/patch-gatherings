const nest = require('depnest')
const { h, computed, when } = require('mutant')

exports.needs = nest({
  'blob.sync.url': 'first',
  'message.html.markdown': 'first'
})

exports.gives = nest(
  'gathering.html.title'
)

exports.create = (api) => {
  return nest('gathering.html.title', title)
  function title ({title, msg, isEditing, onUpdate}) {
    const markdown = api.message.html.markdown

    return h('section.title',
      when(isEditing,
        h('input', {'ev-input': e => onUpdate(e.target.value), value: title}),
        h('a', {href: msg.key}, computed(title, markdown))
      )
    )
  }
}
