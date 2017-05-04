const nest = require('depnest')
const spacetime = require('spacetime')
const { h, computed, when } = require('mutant')

exports.needs = nest({
})

exports.gives = nest('gathering.html.startDateTime')

exports.create = (api) => {
  return nest('gathering.html.startDateTime', startDateTime)
  function startDateTime ({startDateTime, msg, isEditing, onUpdate}) {
    return h('StartDateTime', [
      when(isEditing,
        h('input', {
          'ev-input': e => {
            const dt = e.target.value + 'Z' // HACK? datetime-local doesn't append the zone so we need to.
            onUpdate(dt)
          },
          type: 'datetime-local'
        }),
        [
          h('div', {}, computed(startDateTime, time => {
            return spacetime(time).format('time')
          })),
          h('div', {}, computed(startDateTime, time => {
            return spacetime(time).format('full')
          }))
        ]
      )
    ])
  }
}
