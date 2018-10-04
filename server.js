const budo = require('budo')
const stringify = require('stringify')
const babelify = require('babelify')

const demo = process.argv[2] || 'vdom'

budo(`./demo/${demo}.js`, {
  live: true,             // live reload
  open: true,             // open browser
  debug: true,
  stream: process.stdout, // log to stdout
  browserify: {
    insertGlobalVars: { Buffer: null },
    transform: [
      babelify,   // use ES6
      [stringify, { extensions: [ '.pug', '.jade' ] }]
    ]
  }
})
