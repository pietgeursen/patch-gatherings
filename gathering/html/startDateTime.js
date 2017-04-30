const nest = require('depnest')
const { h, Value, map, computed, when } = require('mutant')

exports.needs = nest({
})

exports.gives = nest('gathering.html.startDateTime')

exports.create = (api) => {
  return nest('gathering.html.startDateTime', startDateTime)
  function startDateTime({obs, msg, isEditing, value}) {
    obs.startDateTime(console.log)
    return when(isEditing, 
      h('input', { 
        'ev-input': e => value.set(e.target.value), 
        value: obs.startDateTime, 
        type: 'datetime-local'
      }), 
      h('div', {}, obs.startDateTime)
    )
  }
}

 



