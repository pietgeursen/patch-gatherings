const nest = require('depnest')
const { h, Value, map, computed } = require('mutant')

exports.needs = nest({
  'about.html.link': 'first'
})

exports.gives = nest('gathering.html.contributors')

exports.create = (api) => {
  return nest('gathering.html.contributors', contributors)

  function contributors ({obs, msg, isEditing}) {
    // TODO handle when hosts / attendees / contributors are not ssb users
    const linkedHosts = computed(obs.contributors, (contributors) => contributors.map(api.about.html.link))
    return h('section.contributors', {}, [
      h('h3', 'contributing:'),
      h('div', linkedContributors)
    ])
  }
}

