const nest = require('depnest')
const { h, computed } = require('mutant')
const spacetime = require('spacetime')

exports.needs = nest({
  'message.html': {
    backlinks: 'first',
    meta: 'map',
    action: 'map',
    timestamp: 'first'
  },
  'about.html.image': 'first',
  'about.obs.color': 'first',
  'blob.sync.url': 'first',
  'gathering.obs.gathering': 'first',
  'gathering.html': {
    'description': 'first',
    'title': 'first',
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

    const { timestamp, meta, backlinks, action } = api.message.html

    const { description, title } = api.gathering.html

    const background = computed(obs.thumbnail, (thumbnail) => `url(${thumbnail})`)
    const content = [
      h('a', { href: msg.key }, [
        h('.toggle-layout', {
          'ev-click': e => {
            e.preventDefault()
            isCard.set(false)
          }
        }, '+'),
        h('.details', [
          title({title: obs.title, msg}),
          description({description: obs.description})
        ]),
        h('.date-splash',
          {
            style: {
              'background-image': background,
              'background-color': api.about.obs.color(msg.key)
            }
          },
          [
            h('div', computed(obs.startDateTime, time => {
              const t = spacetime(time)
              return `${t.format('date')} ${t.format('month-short')}`
            }))
          ]
        )
      ])
    ]

    return h('Message -gathering-card', [
      h('section.avatar', {}, api.about.html.image(msg.value.author)),
      h('section.timestamp', {}, timestamp(msg)),
      h('section.meta', {}, meta(msg)),
      h('section.content', {}, content),
      h('section.actions', {}, action(msg)),
      h('footer.backlinks', {}, backlinks(msg))
    ])
  }
}
