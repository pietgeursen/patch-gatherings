const nest = require('depnest')
const { h } = require('mutant')

exports.needs = nest({
  'blob.sync.url': 'first'
})

exports.gives = nest('gathering.html.thumbnail')

exports.create = (api) => {
  return nest('gathering.html.thumbnail', thumbnail)
  function thumbnail ({ obs, msg }) {
    return h('div.thumbnail', h('img', {src: obs.thumbnail}))
  }
}
