const bulk = require('bulk-require')
const combine = require('depject')
const patchcore = require('patchcore')
const nest = require('depnest')
const {first} = require('depject/apply')
const test = require('pull-test')

const depTest = {
  gives: nest('test'),
  needs: nest({
    'tests': 'reduce'
  }),
  create: function (api) {
    return nest('test', function () {
      const tests = api.tests({})
      test(tests)
    })
  }
}

const modules = combine(
  bulk(__dirname, [
    'gathering/async/*.js',
    'gathering/obs/*.js',
    'gathering/pull/*.js',
    'util/*.js'
  ]),
  patchcore, 
  depTest
)

first(modules.test)()
