const nest = require('depnest')
const { h, Array } = require('mutant')
const pull = require('pull-stream')
const Scroller = require('pull-scroll')

exports.gives = nest({
  'router.html': {
    page: true,
    simpleRoute: true
  }
})

exports.needs = nest({
  'gathering.pull.find': 'first',
  'gathering.html.compose': 'first',
  'gathering.html': {
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

    const composer = api.gathering.html.compose({})
    const gatherings = Array([])
    const content = h('div', {}, gatherings)
    const container = h('div', {}, [content, composer])

    pull(
      api.gathering.pull.find(),
      pull.drain(msg => {
        gatherings.push(api.gathering.html.render(msg))
      })
    )

    return container
  }
}

