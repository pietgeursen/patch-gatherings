const nest = require('depnest')
const { h } = require('mutant')
const pull = require('pull-stream')
const Scroller = require('pull-scroll')

exports.gives = nest({
  'router.html': {
    page: true,
    simpleRoute: true
  }
})

exports.needs = nest({
  'feed.pull.public': 'first',
  'gathering.html.compose': 'first',
  'message.html': {
    render: 'first'
  },
})

exports.create = function (api) {
  const route = '/gatherings'

  return nest({
    'router.html': {
      page: publicPage,
      simpleRoute: menuItem
    }
  })

  function menuItem (handleClick) {
    return h('a', {
      style: { order: 1 },
      'ev-click': () => handleClick(route)
    }, route)
  }

  function publicPage (path) {
    if (path !== route) return

    const composer = api.gathering.html.compose({
    })

    return composer

  }
}

