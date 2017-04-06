const { h, when, send, resolve, Value, computed } = require('mutant')
const nest = require('depnest')
const extend = require('xtend')

exports.needs = nest({
  'blob.html.input': 'first',
  'message.html.confirm': 'first'
})

exports.gives = nest('gathering.html.compose')

exports.create = function (api) {
  return nest({ 'gathering.html.compose': compose })

  function compose() {
    const textArea = 'hi'
    const actions =  ['publish', 'cancel']
    var composer = h('ComposeGathering', [
      textArea,
      actions
    ])
    return composer
  }
}

