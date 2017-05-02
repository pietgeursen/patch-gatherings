const nest = require('depnest')
const { Value, Set, Struct, forEachPair } = require('mutant')

exports.needs = nest({
  'gathering.async': {
    'title': 'first',
    'description': 'first',
    'images': 'first',
    'location': 'first',
    'attendees': 'first',
    'hosts': 'first',
    'startDateTime': 'first'
  }
})

exports.gives = nest('gathering.obs.struct')

exports.create = function (api) {
  return nest('gathering.obs.struct', function (opts = {}) {
    const struct = Struct({
      title: Value(''),
      description: Value(''),
      thumbnail: Value(''),
      startDateTime: Value(''),
      endDateTime: Value(''),
      location: Value(''),
      contributors: Set([]),
      hosts: Set([]),
      attendees: Set([]),
      images: Set([])
    })

    Object.keys(opts).forEach((k) => {
      if (opts[k]) {
        struct[k].set(opts[k])
      }
    })

    struct.save = (id) => {
      forEachPair(struct, (k, v) => {
        if (api.gathering.async[k] && v) {
          api.gathering.async[k]({[k]: v, gathering: id}, console.log)
        }
      })
    }

    return struct
  })
}
