const bulk = require('bulk-require')

module.exports = bulk(__dirname, ['!(node_modules|*.test.js)/**/*.js'])
