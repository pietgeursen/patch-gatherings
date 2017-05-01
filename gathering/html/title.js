const nest = require('depnest')
const { h, computed, when } = require('mutant')

exports.needs = nest({
  'blob.sync.url': 'first'
})

exports.gives = nest(
  'gathering.html.title'
)

exports.create = (api) => {
  return nest('gathering.html.title', title)
  function title ({obs, msg, isEditing, value}) {
    return h('header.title',
      when(isEditing,
        h('input', {'ev-input': e => value.set(e.target.value), value: obs.title}),
        obs.title
      )
    )
  }
}
