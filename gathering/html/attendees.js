const nest = require('depnest')
const { h, Value, map, computed } = require('mutant')

exports.needs = nest({
  'about.html.link': 'first'
})

exports.gives = nest('gathering.html.attendees')

exports.create = (api) => {
  return nest('gathering.html.attendees', attendees)
  
  function attendees({obs, msg, isEditing}) {
    //TODO handle when hosts / attendees / contributors are not ssb users
    const linkedAttendees = computed(obs.attendees, (attendees) => attendees.map(api.about.html.link))
    //linkedAttendees(console.log)
    return h('section.attendees', {}, [
      h('h3', 'attending:'),
      h('div', linkedAttendees)
    ])
  }
}
