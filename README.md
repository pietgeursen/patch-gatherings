> '[patchcore](https://github.com/ssbc/patchcore) gatherings [depject](https://github.com/depject/depject) plugin for [secure scuttlebutt](https://github.com/ssbc/secure-scuttlebutt)'

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
    'setName',
    'setUTCDateTime',
    'setLocation',
    'setDescription',
    'host',
    'rsvp',
    'image',
  ]
})
```

## How gathering messages work

A gathering message is extremely simple. It is little more than intent to have a `gathering`. Location, time, description etc are all `about` messages that link to the gathering message. Hopefully we can reuse these about messages to add metadata on completely different things. Examples could be publishing a location message about a pub or a photo.

## API

### gatherings.pull.find(opts={}, cb)

Returns a new [pull-stream](https://pull-stream.github.io/) of gatherings. Valid `opts` keys include

- `past` (default: `false`) - `true`: Get all gatherings whose utcDateTime is from the past
- `future` (default: `true`) - `true`: Get all gatherings whose utcDateTime is in th efuture
- `hostedBy` (optional) - Get gatherings hosted by a given id
- `attendedBy` (optional) - Get gatherings attended by a given id

### gatherings.async.create(opts={}, cb)

Creates a new gathering message and calls cb when done. Valid `opts` keys include

- `name` (optional) - The name of the gathering 
- `utcDateTime` (optional) - The utc date and time of the gathering 
- `location` (optional) - The location of the gathering
- `description` (optional) - The desctription of the gathering 
- `hosts` (optional) - Hosts of the gathering

### gatherings.async.setName(opts={}, cb)

Sets the name of the gathering and calls cb when done. Valid `opts` keys include

- `id` (required) - The id of the gathering to name
- `name` (required) - The name of the gathering 

### gatherings.async.setUTCDateTime(opts={}, cb)

Sets the time of the gathering and calls cb when done. Valid `opts` keys include

- `id` (required) - The id of the gathering to name
- `utcDateTime` (required) - The time of the gathering 

### gatherings.async.setLocation(opts={}, cb)

Sets the physical location of the gathering and calls cb when done. Valid `opts` keys include

- `id` (required) - The id of the gathering to name
- `location` (required) - The time of the gathering 

### gatherings.async.setDescription(opts={}, cb)

Sets the physical location of the gathering and calls cb when done. Valid `opts` keys include

- `id` (required) - The id of the gathering to name
- `location` (required) - The time of the gathering 

### gatherings.async.host(opts={}, cb)

Adds or removes a host of the gathering and calls cb when done. Valid `opts` keys include

- `id` (required) - The id of the gathering to name
- `host` (required) - The id of the host 
- `val` (required) - `1` if hosting, `0` if not

### gatherings.async.rsvp(opts={}, cb)

Sets user's rsvp of the gathering to attending / maybe / notGoing and calls cb when done. Valid `opts` keys include

- `id` (required) - The id of the gathering to name
- `host` (required) - The id of the host 
- `val` (required) - `1` if attending, `0` if maybe, `-1` if not

## Install

With [npm](https://npmjs.org/) installed, run

```
$ npm install sbot-gatherings
```

## Acknowledgments

sbot-gatherings was inspired by..

## See Also


## License

ISC
