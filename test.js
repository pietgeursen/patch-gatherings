const bulk = require('bulk-require')
const combine = require('depject')
const nest = require('depnest')
const {first} = require('depject/apply')
const test = require('pull-test')

const depTest = {
  gives: nest('runTests'),
  needs: nest({
    'test': 'map',
  }),
  create: function (api) {
    return nest('runTests', function() {
      const tests = api.test()
      const reducedTests = tests.reduce((test, obj) => Object.assign(obj, test), {})
      test(reducedTests)
    })
  }
}

const modules = combine(bulk(__dirname, ['!(node_modules|html|router|async)/**/*.js']), depTest)


first(modules.runTests)()


