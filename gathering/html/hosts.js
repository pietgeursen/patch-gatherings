const nest = require('depnest')
const { h, Value, map, computed, when } = require('mutant')
const addSuggest = require('suggest-box')

exports.needs = nest({
  'about.html.link': 'first',
  'about.async.suggest': 'first',
})

exports.gives = nest('gathering.html.hosts')

exports.create = (api) => {
  return nest('gathering.html.hosts', hosts)
  
  function hosts({obs, msg, isEditing, value}) {
    //TODO handle when hosts / attendees / contributors are not ssb users
    const input = h('input', {'ev-input': e => value.set(e.target.value), value: value()})
    const linkedHosts = computed(obs.hosts, (hosts) => hosts.map(api.about.html.link))

    const inputWithLabel = h('div', [
      h('label', 'Hosts'),
      input
    ])

    const getProfileSuggestions = api.about.async.suggest()

    addSuggest(input, (inputText, cb) => {
      if (inputText[0] === '@') inputText = inputText.slice(1)
      cb(null, getProfileSuggestions(inputText))
    }, {cls: 'SuggestBox'})

    input.addEventListener('suggestselect', ev => {
      value.set(ev.detail.id)
    })

    return when(isEditing, 
      inputWithLabel,
      h('div',linkedHosts)
    )
    
  }
}

