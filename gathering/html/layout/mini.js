const nest = require('depnest')
const { h, computed } = require('mutant')
const spacetime = require('spacetime')

exports.needs = nest({
  'blob.sync.url': 'first',
  'gathering.obs.gathering': 'first',
  'gathering.obs.thumbnail': 'first',
  'gathering.html': {
    'description': 'first',
    'title': 'first',
    'location': 'first',
  }
})

exports.gives = nest('gathering.html.layout')

exports.create = (api) => {
  return nest('gathering.html.layout', gatheringLayout)

  function gatheringLayout (msg, opts) {
    const { layout, obs, isMini } = opts

    if (!(layout === undefined || layout === 'mini')) return

    const { title, location, description, startDateTime } = api.gathering.html

    const thumbnail = api.gathering.obs.thumbnail({obs, msg})
    const background = computed(thumbnail, (thumbnail) => `url(${thumbnail})`)

    return [
      h('section.content', [
        h('a', { href: msg.key }, [
          h('.expand', { 'ev-click': () => isMini.set(false) }, '+'),
          h('.details', [
            title({obs, msg}),
            location({obs, msg}),
            description({obs}),
          ]),
          h('.date-splash', 
            { style: { 'background-image': background } },
            [
              h('div', computed(obs.startDateTime, time => {
                const t = spacetime(time)
                return `${t.format('date')} ${t.format('month-short')}`
              }))
            ]
          )
        ])
      ])
    ]
  }
}
