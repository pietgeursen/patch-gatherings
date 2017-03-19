const { h } = require('mutant')
const nest = require('depnest')
const pull = require('pull-stream')
const Scroller = require('pull-scroll')

exports.gives = nest('router.html.page')

exports.needs = nest({
  'gathering.html.render': 'first',
  'main.html.scroller': 'first',
  'message.html.compose': 'first',
  'feed.pull.gatherings.find': 'first'
})

exports.create = function (api) {
  return nest('router.html.page', gatheringsPage)

  function gatheringsPage(path) {
    if (path !== '/gatherings') return
    const { find } = api.feed.pull.gatherings
    pull(
      find(),
      pull.log()
    )

    const composer = api.message.html.compose({
      meta: { type: 'gathering' },
      placeholder: 'Create a public gathering'
    })

    const { container, content } = api.main.html.scroller({prepend: composer})

    pull(
      find({old: false, limit: 100}),
      Scroller(container, content, api.gathering.html.render, true, false)
    )

    pull(
      find({reverse: true, limit: 100, live: false}),
      Scroller(container, content, api.gathering.html.render, false, false)
    )
    return container
  }
}

