const h = require('mutant/h')
const Value = require('mutant/value')
const when = require('mutant/when')
const nest = require('depnest')

exports.needs = nest({
  'blob.sync.url': 'first',
  'gathering.obs.gathering': 'first',
  'gathering.html': {
    'layout': 'first'
  },
  'gathering.async.attendees': 'first',
  'feed.html.render': 'first',
  'keys.sync.load': 'first',
  'about.html.link': 'first',
  'message.html': {
    decorate: 'reduce',
    link: 'first',
    markdown: 'first'
  },
})

exports.gives = nest({
  'message.html': ['render'],
  'gathering.html': ['render'],
})

exports.create = function (api) {
  return nest({
    'message.html.render': renderGathering,
    'gathering.html.render': renderGathering,
  })
  function renderGathering (msg, { pageId } = {}) {
    if (!msg.value || (msg.value.content.type !== 'gathering')) return

    const isEditing = Value(false)
    const isCard = Value(true)
   
    if(pageId === msg.key) isCard.set(false)

    const obs = api.gathering.obs.gathering(msg.key)

    const element = h('div', {attributes: {tabindex: '0'}},
      when(isCard,
        api.gathering.html.layout(msg, {layout: 'card', isEditing, isCard, obs}),
        api.gathering.html.layout(msg, {layout: 'detail', isEditing, isCard, obs})
    ))

    return api.message.html.decorate(element, { msg })
  }
}
