const nest = require('depnest')
const { h, Value, map, computed } = require('mutant')

exports.needs = nest({
  'about.html.link': 'first'
})

exports.gives = nest('gathering.html.hosts')

exports.create = (api) => {
  return nest('gathering.html.hosts', hosts)
  
  function hosts({obs, msg, isEditing}) {
    //TODO handle when hosts / attendees / contributors are not ssb users
    const linkedHosts = computed(obs.hosts, (hosts) => hosts.map(api.about.html.link))
    return h('section.hosts', {}, [
      h('h3', 'hosting:'),
      h('div',linkedHosts)
    ])
  }
}

