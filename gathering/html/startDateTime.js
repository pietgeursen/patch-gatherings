const nest = require('depnest')
const spacetime = require('spacetime')
const moment = require('moment')
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
    const input = h('input.date', {
      'ev-change': ({target: {value}}) => {
        onUpdate(value * 1000)
      },
    })
    const div = h('div', input)
    const picker = new Pickr(input, {
      enableTime: true,
      altInput: true,
      dateFormat: 'U'
    })

    startDateTime((t) => {
      if(t && t.epoch) picker.setDate(t.epoch)
    })

    return h('StartDateTime', [
      when(isEditing,
        div,
        [
          h('div', {}, computed(startDateTime, time => {
            return time && time.epoch ? moment(time.epoch).format('LT') : ''
          })),
          h('div', {}, computed(startDateTime, time => {
            return time && time.epoch ? moment(time.epoch).format('LL') : ''
          }))
        ]
      )
    ])
  }
}
