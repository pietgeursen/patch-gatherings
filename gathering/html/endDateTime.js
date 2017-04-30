const nest = require('depnest')
const { h, Value, map, computed } = require('mutant')

exports.needs = nest({
})

exports.gives = nest('gathering.html.endDateTime')

exports.create = (api) => {
  return nest('gathering.html.endDateTime', endDateTime)
  function endDateTime ({obs, msg, isEditing}) {
    return h('div', {}, obs.endDateTime)
  }
}

