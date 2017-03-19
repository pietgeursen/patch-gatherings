const { h } = require('mutant')
const nest = require('depnest')

exports.gives = nest('router.html.page')

exports.needs = nest({
  'message.html.render.gatherings': 'first',
  'main.html.scroller': 'first'
})

exports.create = function (api) {
  return nest('router.html.page', gatheringsPage)
  function gatheringsPage(path) {
    if (path !== '/gatherings') return
    return h('h1', {}, 'Fuck') 
      
  }
}

