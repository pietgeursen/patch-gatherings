const nest = require('depnest')
const { computed } = require('mutant')

exports.gives = nest('gathering.obs.thumbnail')

exports.needs = nest({
  'blob.sync.url': 'first'
})

exports.create = (api) => {
  return nest('gathering.obs.thumbnail', thumbnail)

  function thumbnail ({ obs, msg }) {
    // TODO: Take the last published image as the thumbnail for now. Soon: Make thumbnail message so you can choose one.
    return computed(obs.images, images => {
      return images.length > 0
        ? api.blob.sync.url(images[images.length - 1])
        : undefined
    })
  }
}
