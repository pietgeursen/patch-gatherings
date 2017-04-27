const nest = require('depnest')
const { h, Value, map, computed } = require('mutant')

exports.needs = nest({
})

exports.gives = nest('gathering.html.startDateTime')

exports.create = (api) => {
  return nest('gathering.html.startDateTime', startDateTime)
  function startDateTime({obs, msg, isEditing}) {
    return h('div', {}, obs.startDateTime)
  }
}

 



