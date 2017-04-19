const { h, when, send, resolve, Value, computed } = require('mutant')
const nest = require('depnest')
const extend = require('xtend')

exports.needs = nest({
  'gathering.async.create': 'first',
  'blob.html.input': 'first',
  'message.html.confirm': 'first'
})

exports.gives = nest('gathering.html.create')

exports.create = function (api) {
  return nest({ 'gathering.html.create': create })

  function create() {
    const actions = h('button', {'ev-click': () => api.gathering.async.create()}, 'Create')
    var composer = h('div', [
      actions
    ])
    return composer
  }
}

