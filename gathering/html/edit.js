const { h, when, send, resolve, Value, computed } = require('mutant')
const nest = require('depnest')
const extend = require('xtend')

exports.needs = nest({
  'gathering.async.create': 'first',
  'gathering.async.description': 'first',
  'gathering.async.title': 'first',
  'gathering.async.location': 'first',
  'blob.html.input': 'first',
  'message.html.confirm': 'first',
  'about.async.suggest': 'first',
})

exports.gives = nest('gathering.html.edit')

exports.create = function (api) {
  return nest({ 'gathering.html.edit': edit })

  function edit(obs, msg, isEditing) {
    var channelInputFocused = Value(false)
    var textAreaFocused = Value(false)
    var focused = computed([channelInputFocused, textAreaFocused], (a, b) => a || b)
    var hasContent = Value(false)
    var getProfileSuggestions = api.about.async.suggest()

    var blurTimeout = null

    var description = h('textarea', {}, obs.description)
    var title = h('textarea', {}, obs.title)
    var location = h('textarea', {}, obs.location)

    const cancel = h('button', {'ev-click': () => isEditing.set(false)}, 'Cancel')
    const update = h('button', {'ev-click': () => {
      api.gathering.async.description({description: description.value, id: msg.key}, (err) => {})
      api.gathering.async.title({title: title.value, id: msg.key}, (err) => {})
      api.gathering.async.location({location: location.value, id: msg.key}, (err) => {})
      isEditing.set(false)
    }}, 'Update')

    var edit = h('ComposeGathering', [
      title,
      description,
      location,
      update,
      cancel,
    ])

    return edit
  }
}
