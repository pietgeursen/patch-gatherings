const nest = require('depnest')
const { h, Value, when, computed } = require('mutant')

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
    'message.html.render': renderGathering, // TODO : move out
    'gathering.html.render': renderGathering,
    'app.html.tabs': tabs
  })

  function renderGathering (msg) {
    if (!msg.value || (msg.value.content.type !== 'gathering')) return
    
    const isEditing = Value(false)
    const isMini = Value(true)

    const tabs = api.app.html.tabs()
    if(tabs){
      const tabId = tabs.getCurrent().firstChild.id
      if(tabId === msg.key) isMini.set(false)
    }

    const obs = api.gathering.obs.gathering(msg.key)
    const className = when(isMini, '-gathering-mini', '-gathering')
    const layout = when(isMini, 'mini', 'default')

    const element = h('Message',
      { className, attributes: {tabindex: '0'} },
      computed(layout, layout => {
        return api.gathering.html.layout(msg, { layout, isEditing, isMini, obs })
      })
    )

    return api.message.html.decorate(element, { msg })
  }

  function tabs() {
    return null 
  }
}
