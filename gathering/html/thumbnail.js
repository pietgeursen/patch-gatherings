const nest = require('depnest')
const { h, computed, when } = require('mutant')

exports.needs = nest({
  'blob.sync.url': 'first'
})

exports.gives = nest('gathering.html.thumbnail')

exports.create = (api) => {
  return nest('gathering.html.thumbnail', thumbnail)
  function thumbnail ({ obs, msg }) {
    // TODO: Take the last published image as the thumbnail for now. Soon: Make thumbnail message so you can choose one.
    const src = computed(obs.images, images => {
      return images.length
        ? api.blob.sync.url(images[images.length - 1])
        : 'data:image/gif;base64,R0lGODlhAQABAPAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='
    })
    return when(src, h('img', {src}))
  }
}
