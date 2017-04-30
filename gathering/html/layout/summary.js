const nest = require('depnest')
const { h } = require('mutant')

exports.needs = nest({
  'blob.sync.url': 'first',
  'gathering.obs.gathering': 'first',
  'gathering.html': {
    'title': 'first',
    'thumbnail': 'first',
    'location': 'first',
    'startDateTime': 'first'
  }
})

exports.gives = nest('gathering.html.layout')

exports.create = (api) => {
  return nest('gathering.html.layout', gatheringLayout)

  function gatheringLayout (msg, opts) {
    const { layout, obs, isSummary } = opts

    if (!(layout === undefined || layout === 'summary')) return

    const { title, thumbnail, location, startDateTime } = api.gathering.html

    return [
      h('button', { 'ev-click': () => isSummary.set(false) }, 'More...'),
      h('section.content',
        h('Summary', [
          thumbnail({obs, msg}),
          h('.details', [
            title({obs, msg}),
            location({obs, msg}),
            startDateTime({obs, msg})
          ])
        ]))
    ]
  }
}
