const bulk = require('bulk-require')
const combine = require('depject')
const nest = require('depnest')
const {first} = require('depject/apply')
const test = require('pull-test')

const depTest = {
  gives: nest('test'),
  needs: nest({
    'tests': 'reduce',
  }),
  create: function (api) {
    return nest('test', function() {
      const tests = api.tests({})
      test(tests)
    })
  }
}

const modules = combine(bulk(__dirname, ['!(node_modules|html|router)/**/*.js']), depTest)

first(modules.test)()


