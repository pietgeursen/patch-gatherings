const { h, when, concat, send, resolve, Value, computed, forEach, Array, Set, map} = require('mutant')
const nest = require('depnest')
const extend = require('xtend')

exports.needs = nest({
  'gathering.async.create': 'first',
  'gathering.async.description': 'first',
  'gathering.async.title': 'first',
  'gathering.async.location': 'first',
  'gathering.async.images': 'first',
  'blob.html.input': 'first',
  'message.html.confirm': 'first',
  'about.async.suggest': 'first',
  'blob.sync.url': 'first',
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
    var imagesToAdd = Set([]) 
    var allImages = Set([]) 
    imagesToAdd(images => forEach(images, image => allImages.add(image.link))) //TODO: so that we still publish an image with all the info but just use the link for now.
    obs.images(images => forEach(images, image => allImages.add(image)))

    var blurTimeout = null

    var description = h('textarea', {}, obs.description)
    var title = h('textarea', {}, obs.title)
    var location = h('textarea', {}, obs.location)
    var images = h('div', {}, map(allImages, image => h('img', {src: api.blob.sync.url(image)} )))

    const cancel = h('button', {'ev-click': () => isEditing.set(false)}, 'Cancel')
    const update = h('button', {'ev-click': () => {
      api.gathering.async.description({description: description.value, id: msg.key}, (err) => {})
      api.gathering.async.title({title: title.value, id: msg.key}, (err) => {})
      api.gathering.async.location({location: location.value, id: msg.key}, (err) => {})
      api.gathering.async.images({images: imagesToAdd(), id: msg.key}, (err) => {})
      isEditing.set(false)
    }}, 'Update')

    var fileInput = api.blob.html.input(file => {
      imagesToAdd.add(file)
    })

    fileInput.onclick = () => hasContent.set(true)

    var edit = h('ComposeGathering', [
      title,
      images,
      description,
      fileInput,
      location,
      update,
      cancel,
    ])

    return edit
  }
}

