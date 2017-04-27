const nest = require('depnest')
const { h, computed } = require('mutant')

exports.needs = nest({
  'message.html.markdown': 'first'
})

exports.gives = nest('gathering.html.description')

exports.create = (api) => {
  return nest('gathering.html.description', description)
  function description({obs, msg, isEditing}) {
    const markdown = api.message.html.markdown
    return h('div', {}, computed(obs.description, markdown))
  }
}

 



