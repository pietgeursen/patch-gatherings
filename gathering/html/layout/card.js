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
    const { layout, obs, isCard } = opts

    if (!(layout === undefined || layout === 'card')) return

    const { title, thumbnail, location, startDateTime } = api.gathering.html

    return [
      h('Message -gathering-card', [
        h('button', { 'ev-click': () => isCard.set(false) }, 'More...'),
        h('section.content',
          [
            thumbnail({thumbnail: obs.thumbnail, msg}),
            h('.details', [
              title({title: obs.title, msg}),
              startDateTime({startDateTime: obs.startDateTime , msg})
            ])
          ])
      ])
    ]
  }
}
