const nest = require('depnest')
const { h, computed } = require('mutant')
const spacetime = require('spacetime')

exports.needs = nest({
  'app.sync.goTo': 'first',
  'message.html': {
    author: 'first',
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

    const { author, timestamp, meta, backlinks, action } = api.message.html

    const { description, title } = api.gathering.html

    const onClick = () => api.app.sync.goTo(msg.key)
    const background = computed(obs.thumbnail, (thumbnail) => `url(${thumbnail})`)
    const content = [
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
    ]

    return h('Message -gathering-card', {
      'ev-click': onClick,
      attributes: { tabindex: '0' } // needed to be able to navigate and show focus()
    }, [
      h('section.avatar', api.about.html.image(msg.value.author)),
      h('section.top', [
        // h('div.author', author(msg)),
        // h('div.title'),
        // h('div.meta', meta(msg))
      ]),
      h('section.content', content),
      h('section.raw-content'), //, rawMessage),
      h('section.bottom', [
        h('div.timestamp', timestamp(msg)),
        h('div.actions', action(msg))
      ]),
      h('footer.backlinks', backlinks(msg))
    ])
  }
}
