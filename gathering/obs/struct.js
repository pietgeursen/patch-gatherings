const nest = require('depnest')
const { Value, Set, Struct } = require('mutant')

exports.needs = nest({
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
    return struct
  })
}

