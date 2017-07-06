const nest = require('depnest')
const { h, map, when } = require('mutant')

exports.needs = nest({
  'blob.sync.url': 'first',
  'blob.html.input': 'first'
})

exports.gives = nest('gathering.html.images')

exports.create = (api) => {
  return nest('gathering.html.images', images)

  function images ({images, msg, isEditing, onUpdate}) {
    const fileInput = api.blob.html.input(file => onUpdate(file))

    return h('section.images', {}, [
      map(images, image => h('img', {src: api.blob.sync.url(image)})),
      when(isEditing, [h('div', 'Add an image:'), fileInput])
    ])
  }
}
