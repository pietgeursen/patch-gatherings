const nest = require('depnest')
const { h, Value, computed } = require('mutant')
const spacetime = require('spacetime')

exports.needs = nest({
  'message.html': {
    backlinks: 'first',
    author: 'first',
    meta: 'map',
    action: 'map',
    timestamp: 'first'
  },
  'about.html.avatar': 'first',

  'about.obs.color': 'first',
  'blob.sync.url': 'first',
  'gathering.obs.gathering': 'first',
  'gathering.obs.thumbnail': 'first',
  'gathering.html': {
    'description': 'first',
    'title': 'first',
    'location': 'first'
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

    const { author, timestamp, meta, action, backlinks } = api.message.html
    // if (!isMsg(msg.key)) action = () => {}

    var rawMessage = Value(null)

    const content = [
      h('a', { href: msg.key }, [
        h('.expand', { 'ev-click': () => isMini.set(false) }, '+'),
        h('.details', [
          title({obs, msg}),
          location({obs, msg}),
          description({obs})
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

    return [
      h('section.avatar', {}, api.about.html.avatar(msg.value.author)),
      h('section.timestamp', {}, timestamp(msg)),
      // h('header.author', {}, author(msg)),
      h('section.meta', {}, meta(msg, { rawMessage })),
      // h('section.title', {}, opts.title),
      h('section.content', {}, content),
      h('section.raw-content', rawMessage),
      h('section.actions', {}, action(msg)),
      h('footer.backlinks', {}, backlinks(msg))
    ]
  }
}
