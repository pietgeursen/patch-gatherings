const nest = require('depnest')
const { h, Value, map, computed, when } = require('mutant')

exports.needs = nest({
  'blob.sync.url': 'first',
  'message.html.markdown': 'first',
})

exports.gives = nest(
  'gathering.html.title'
)

exports.create = (api) => {
  return nest('gathering.html.title', title)
  function title({obs, msg, isEditing, editedTitle}) {
    const markdown = api.message.html.markdown

    return when(isEditing, 
      h('input', {'ev-input': e => editedTitle.set(e.target.value), value: editedTitle}),
      h('a', {href: msg.key}, computed(obs.title, markdown))
    )
  }
}

 
