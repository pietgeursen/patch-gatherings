const nest = require('depnest')
const { h, computed, when } = require('mutant')

exports.needs = nest({
  'message.html.markdown': 'first'
})

exports.gives = nest('gathering.html.description')

exports.create = (api) => {
  return nest('gathering.html.description', description)
  function description ({obs, isEditing, value}) {
    const markdown = api.message.html.markdown
    const input = h('textarea', {'ev-input': e => value.set(e.target.value), value: obs.description()})

    const inputWithLabel = h('Description', [
      h('label', 'Description'),
      input
    ])

    return when(isEditing,
      inputWithLabel,
      h('Description', computed(obs.description, markdown))
    )
  }
}
