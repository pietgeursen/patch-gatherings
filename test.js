const bulk = require('bulk-require')
const combine = require('depject')
const {map} = require('depject/apply')
const test = require('pull-test')

const modules = combine(bulk(__dirname, ['!(node_modules|html|router|async)/**/*.js']))

const tests = map(modules.test)()
const reducedTests = tests.reduce((test, obj) => Object.assign(obj, test), {})
test(reducedTests)


