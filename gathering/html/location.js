const nest = require('depnest')
const { h, computed } = require('mutant')

exports.needs = nest({
  'message.html.markdown': 'first'
})

exports.gives = nest('gathering.html.location')

exports.create = (api) => {
  return nest('gathering.html.location', location)
  function location ({location, msg, isEditing, onUpdate}) {
    const markdown = api.message.html.markdown
    location = computed(location, loc => loc ? markdown(loc) : '')

    return h('div', {}, location)
  }
}
