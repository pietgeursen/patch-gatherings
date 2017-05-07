const nest = require('depnest')
const { map } = require('mutant')

exports.needs = nest({
  'about.html.link': 'first',
  'about.html.image': 'first',
  'about.obs.name': 'first'
})

exports.gives = nest('gathering.html.attendees')

exports.create = (api) => {
  return nest('gathering.html.attendees', attendees)

  function attendees ({ attendees, msg }) {
    // TODO handle when hosts / attendees / contributors are not ssb users

    return map(attendees, (attendee) => {
      return api.about.html.link(attendee, api.about.html.image(attendee))
    })
  }
}
