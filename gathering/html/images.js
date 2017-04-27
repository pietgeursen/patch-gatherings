const nest = require('depnest')
const { h, Value, Set, map, computed, concat } = require('mutant')

exports.needs = nest({
  'blob.sync.url': 'first',
  'blob.html.input': 'first',
})

exports.gives = nest('gathering.html.images')

exports.create = (api) => {
  return nest('gathering.html.images', images)
  function images({obs, msg, isEditing}) {
    var imagesToAdd = Set([]) 
    var allImages = Set([]) 
    imagesToAdd(images => forEach(images, image => allImages.add(image.link))) //TODO: so that we still publish an image with all the info but just use the link for now.
    obs.images(images => forEach(images, image => allImages.add(image)))

    var fileInput = api.blob.html.input(file => {
      imagesToAdd.add(file)
    })

    return h('div', {}, concat([
      map(allImages, image => h('img', {src: api.blob.sync.url(image)} )),
      fileInput
    ]))

  }
}

 

