const nest = require('depnest')
const spacetime = require('spacetime')
const { h, computed, when } = require('mutant')

exports.needs = nest({
})

exports.gives = nest('gathering.html.startDateTime')

exports.create = (api) => {
  return nest('gathering.html.startDateTime', startDateTime)
  function startDateTime ({obs, msg, isEditing, value}) {
    return when(isEditing,
      h('input', {
        'ev-input': e => {
          const dt = e.target.value + 'Z' // HACK? datetime-local doesn't append the zone so we need to.
          value.set(dt)
        },
        type: 'datetime-local'
      }),
      h('div', {}, computed(obs.startDateTime, time => {
        return spacetime(time).format('nice')
      }))
    )
  }
}
