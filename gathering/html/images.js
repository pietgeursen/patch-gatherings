const nest = require('depnest')
const { h, Value, map, computed } = require('mutant')

exports.needs = nest({
  'blob.sync.url': 'first',
})

exports.gives = nest('gathering.html.images')

exports.create = (api) => {
  return nest('gathering.html.images', images)
  function images({obs, msg}) {
    return h('div', {}, map(obs.images, image => h('img', {src: api.blob.sync.url(image)} )))
  }
}

 

