const nest = require('depnest')
const { h, Value, map } = require('mutant')
const { isMsg } = require('ssb-ref')

exports.needs = nest({
  'blob.sync.url': 'first',
  'gathering.obs.gathering': 'first',
  'gathering.html': {
    'title': 'first',
    'thumbnail': 'first',
    'location': 'first',
    'endDateTime': 'first',
    'startDateTime': 'first'
  }
})

exports.gives = nest('gathering.html.layout')

exports.create = (api) => {
  return nest('gathering.html.layout', gatheringLayout)

  function gatheringLayout (msg, opts) {
    const { layout, obs, isEditing, isSummary } = opts

    if (!(layout === undefined || layout === 'summary')) return

    const { title, thumbnail, location, startDateTime, endDateTime } = api.gathering.html

    return [
      h('button', {'ev-click': () => isSummary.set(false) }, 'More...'),
      h('section.content', [
        title({obs, msg}),
        thumbnail({obs, msg}),
        location({obs, msg}),
        h('section.time', {}, [
          h('h3', 'When:'),
          startDateTime({obs, msg}),
          endDateTime({obs, msg})
        ])
      ])
    ]
  }
}

