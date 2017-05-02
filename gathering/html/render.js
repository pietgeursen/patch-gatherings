const h = require('mutant/h')
const Value = require('mutant/value')
const when = require('mutant/when')
const nest = require('depnest')

exports.needs = nest({
  'blob.sync.url': 'first',
  'gathering.obs.gathering': 'first',
  'gathering.html.layout': 'first',
  'gathering.async.attendees': 'first',
  'feed.html.render': 'first',
  'keys.sync.load': 'first',
  'about.html.link': 'first',
  'message.html': {
    decorate: 'reduce',
    link: 'first',
    markdown: 'first'
  },
  'app.html.tabs': 'first'
})

exports.gives = nest({
  'message.html': ['render'],
  'gathering.html': ['render'],
  'app.html': ['tabs']
})

exports.create = function (api) {
  return nest({
    'message.html.render': renderGathering,
    'gathering.html.render': renderGathering,
    'app.html.tabs': tabs
  })
  function renderGathering (msg, opts) {
    if (!msg.value || (msg.value.content.type !== 'gathering')) return

    const isEditing = Value(false)
    const isMini = Value(true)

    const tabs = api.app.html.tabs()
    if (tabs) {
      const tabId = tabs.getCurrent().firstChild.id
      if (tabId === msg.key) isMini.set(false)
    }

    const obs = api.gathering.obs.gathering(msg.key)

    const element = h('div', {attributes: {tabindex: '0'}},
      when(isMini,
        api.gathering.html.layout(msg, {layout: 'mini', isEditing, isMini, obs}),
        api.gathering.html.layout(msg, {layout: 'default', isEditing, isMini, obs})
    ))

    return api.message.html.decorate(element, { msg })
  }
  function tabs () {
    return null
  }
}
