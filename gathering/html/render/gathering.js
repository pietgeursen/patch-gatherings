var h = require('mutant/h')
var nest = require('depnest')
var extend = require('xtend')

exports.needs = nest({
})

exports.gives = nest('gathering.html.render')

exports.create = function (api) {
  return nest('gathering.html.render', function renderGathering (msg, opts) {
    if (msg.value.content.type !== 'gathering') return
    return h('div', {}, 'Gatherings')

    var element = api.message.html.layout(msg, extend({
      title: messageTitle(msg),
      content: messageContent(msg),
      layout: 'default'
    }, opts))

    return api.message.html.decorate(element, { msg })
  })

  function messageContent (data) {
    if (!data.value.content || !data.value.content.text) return
    return h('div', {}, api.message.html.markdown(data.value.content))
  }

  function messageTitle (data) {
    var root = data.value.content && data.value.content.root
    return !root ? null : h('span', ['re: ', api.message.html.link(root)])
  }
}
