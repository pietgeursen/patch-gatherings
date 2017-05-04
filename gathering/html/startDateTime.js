const nest = require('depnest')
const spacetime = require('spacetime')
const fs = require('fs')
const { h, computed, when } = require('mutant')
const insertCss = require('insert-css')
const Pickr = require('flatpickr')
const stylePath = require.resolve("flatpickr/dist/flatpickr.css");

const styleCss = fs.readFileSync(stylePath, 'UTF8')
insertCss(styleCss)

exports.needs = nest({
})

exports.gives = nest('gathering.html.startDateTime')

exports.create = (api) => {
  return nest('gathering.html.startDateTime', startDateTime)
  function startDateTime ({startDateTime, msg, isEditing, onUpdate}) {
    //Todo: borders on inputs
    //split out time and date
    //sensible default if none defined
    console.log(startDateTime())
    const input = h('input')
    const picker = new Pickr(input, {})

    return h('StartDateTime', [
      when(isEditing,
        input,
        [
          h('div', {}, computed(startDateTime, time => {
            return spacetime(time).format('time')
          })),
          h('div', {}, computed(startDateTime, time => {
            return spacetime(time).format('full')
          }))
        ]
      )
    ])
  }
}
