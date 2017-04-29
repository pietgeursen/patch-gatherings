var nest = require('depnest')
var { Value, Set, Struct } = require('mutant')

exports.needs = nest({
})

exports.gives = nest('gathering.obs.struct')

exports.create = function (api) {
  return nest('gathering.obs.struct', function (opts = {}) {
    const defaults = {
      title: '',
      description: '',
      thumbnail: '',
      startDate: '',
      endDate: '',
      location: '',
      contributors: [],
      hosts: [],
      attendees: [],
      images: []
    }
    return Struct(Object.assign({}, defaults, opts))
  })
}

