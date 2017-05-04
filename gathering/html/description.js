const nest = require('depnest')
const { h, computed, when } = require('mutant')

exports.needs = nest({
  'message.html.markdown': 'first'
})

exports.gives = nest('gathering.html.description')

exports.create = (api) => {
  return nest('gathering.html.description', description)
  function description ({description, isEditing, onUpdate}) {
    const markdown = api.message.html.markdown
    const input = h('textarea', {'ev-input': e => onUpdate(e.target.value), value: description})

    return h('Description', [
      when(isEditing,
        input,
        computed(description, markdown)
      )
    ])
  }
}
