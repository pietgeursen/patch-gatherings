const { h } = require('mutant')
const nest = require('depnest')
const pull = require('pull-stream')

exports.gives = nest('router.html.page')

exports.needs = nest({
  'gathering.html.render': 'first',
  'main.html.scroller': 'first',
  'feed.pull.gatherings': 'first'
})

exports.create = function (api) {
  return nest('router.html.page', gatheringsPage)
  function gatheringsPage(path) {
    if (path !== '/gatherings') return
    pull(
      api.feed.pull.gatherings(),
      pull.log()
    )

    return h('h1', {}, 'Fuck') 
      
  }
}

