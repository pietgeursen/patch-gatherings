const nest = require('depnest')
const { h } = require('mutant')

exports.needs = nest({
  'blob.sync.url': 'first'
})

exports.gives = nest('gathering.html.thumbnail')

exports.create = (api) => {
  return nest('gathering.html.thumbnail', thumbnail)

  function thumbnail ({ thumbnail, msg }) {
    return h('div.thumbnail', h('img', {src: thumbnail}))
  }
}
