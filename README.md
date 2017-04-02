# !!! WIP !!!
> [patchcore](https://github.com/ssbc/patchcore) gatherings [depject](https://github.com/depject/depject) plugin for [secure scuttlebutt](https://github.com/ssbc/secure-scuttlebutt)

`gives` pull-stream sources and async methods for finding and publishing gatherings on secure scuttlebutt

## Needs
```js
exports.needs = nest({
  'sbot.pull.messagesByType': 'first',
  'sbot.pull.links': 'first',
})
```

## Gives
```js
exports.gives = nest({
  'gatherings.pull': [
    'find'
  ],
  'gatherings.async': [
    'create',
    'title',
    'description',
    'contributors',
    'startDate',
    'endDate',
    'location',
    'hosts',
    'attendees',
    'images',
  ]
})
```

## How gathering messages work

A gathering message is extremely simple. It is little more than intent to have a `gathering`. Location, time, description etc are all `about` messages that link to the gathering message. Hopefully we can reuse these about messages to add metadata on completely different things. Examples could be publishing a location message about a pub or a photo.

## API

### gatherings.pull.find(opts={}, cb)

Returns a new [pull-stream](https://pull-stream.github.io/) of gatherings. Valid `opts` keys include

- `past` (default: `false`) - `true`: Get all gatherings whose utcDateTime is from the past
- `future` (default: `true`) - `true`: Get all gatherings whose utcDateTime is in the future
- `hostedBy` (optional) - Get gatherings hosted by a given id
- `attendedBy` (optional) - Get gatherings attended by a given id

### gatherings.async.create(opts={}, cb)

Creates a new gathering message and calls cb when done. Valid `opts` keys are any of the other async function names, eg `title`, `description` etc

### gatherings.async.title(opts={}, cb)

Sets the title of the gathering and calls cb when done. Valid `opts` keys include

- `id` (required) - The id of the gathering to title
- `title` (required) - The title of the gathering 

### gatherings.async.startDate(opts={}, cb)

Sets the utc start dateTime of the gathering and calls cb when done. Valid `opts` keys include

- `id` (required) - The id of the gathering to link to.
- `utcDateTime` (required) - The time of the gathering 

### gatherings.async.endDate(opts={}, cb)

Sets the utc end dateTime of the gathering and calls cb when done. Valid `opts` keys include

- `id` (required) - The id of the gathering to link to.
- `utcDateTime` (required) - The time of the gathering 

### gatherings.async.location(opts={}, cb)

Sets the physical location of the gathering and calls cb when done. Valid `opts` keys include

- `id` (required) - The id of the gathering to link to.
- `location` (required) - The location of the gathering 

### gatherings.async.description(opts={}, cb)

Sets the physical location of the gathering and calls cb when done. Valid `opts` keys include

- `id` (required) - The id of the gathering to link to.
- `description` (required) - The description of the gathering 

### gatherings.async.hosts(opts={}, cb)

Adds or removes hosts of the gathering and calls cb when done. Valid `opts` keys include

- `id` (required) - The id of the gathering to link to.
- `hosts` (required) - an array of hosts where each host is an object that has keys:
  - `id` (required) - The id of the host.
  - `remove` (default: false) - Remove this id as a host.

eg:
```js
gatherings.async.hosts({
  id: '',
  hosts: [
    {id: ''},  //adds the host
    {id: '', remove: true}, // removes the host 
  ]
}, err => console.log(err))
```
### gatherings.async.images(opts={}, cb)

Adds or removes images of the gathering and calls cb when done. Valid `opts` keys include

- `id` (required) - The id of the gathering to link to.
- `images` (required) - an array of blob ids:
eg:
```js
gatherings.async.images({
  id: '',
  images: [
    '',
    ''
  ]
}, err => console.log(err))
```

### gatherings.async.attendees(opts={}, cb)

Adds or removes attendees of the gathering and calls cb when done. Valid `opts` keys include

- `id` (required) - The id of the gathering to link to.
- `attendees` (required) - an array of attendees where each host is an object that has the keys:
  - `id` (required) - The id of the host.
  - `remove` (default: false) - Remove this id as an attendee.

eg:
```js
gatherings.async.attendees({
  id: '',
  attendees: [
    {id: ''},  //adds the attendee
    {id: '', remove: true}, // removes the attendee 
  ]
}, err => console.log(err))
```
### gatherings.async.contributors(opts={}, cb)

Adds or removes contributors of the gathering and calls cb when done. Valid `opts` keys include

- `id` (required) - The id of the gathering to link to.
- `contributors` (required) - an array of contributors where each host is an object that has the keys:
  - `id` (required) - The id of the host.
  - `remove` (default: false) - Remove this id as a contributor.

eg:
```js
gatherings.async.contributors({
  id: '',
  contributors: [
    {id: ''},  //adds the contributor
    {id: '', remove: true}, // removes the contributor 
  ]
}, err => console.log(err))
```

## Install

With [npm](https://npmjs.org/) installed, run

```
$ npm install sbot-gatherings
```

## Prior art
- [schema.org/Event](https://schema.org/Event)
- [linked events](http://linkedevents.org/ontology/)

## Acknowledgments

sbot-gatherings was inspired by..

## See Also


## License

ISC
