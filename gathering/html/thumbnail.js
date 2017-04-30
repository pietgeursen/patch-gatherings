const nest = require('depnest')
const { h, computed } = require('mutant')

exports.needs = nest({
  'blob.sync.url': 'first',
})

exports.gives = nest('gathering.html.thumbnail')

exports.create = (api) => {
  return nest('gathering.html.thumbnail', thumbnail)
  function thumbnail({ obs, msg }) {
    return h('img', { src: computed([obs.images], (images) => api.blob.sync.url(images[images.length - 1])) })
  }
}

 


