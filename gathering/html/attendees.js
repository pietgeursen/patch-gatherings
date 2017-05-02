const nest = require('depnest')
const { h, computed, map } = require('mutant')

exports.needs = nest({
  'about.html.link': 'first'
})

exports.gives = nest('gathering.html.attendees')

exports.create = (api) => {
  return nest('gathering.html.attendees', attendees)

  function attendees ({obs, msg, isEditing}) {
    // TODO handle when hosts / attendees / contributors are not ssb users
    const linkedAttendees = map(obs.attendees, (attendee) => h('div', api.about.html.link(attendee)))
    return h('section.attendees', {}, [
      h('div.attendees', linkedAttendees)
    ])
  }
}
