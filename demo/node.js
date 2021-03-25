const fs = require('fs')
const fnPug = require('../index')
const h = require('virtual-dom/h')
const runtime = require('../lib/runtime/vdom').default

const source = fs.readFileSync('./demo/demo.pug', 'utf-8')
const result = fnPug(source)

const factory = Function('$$', result.code + '; return template')
const template = factory(runtime(h))

const context = {}

const nodes = template.call(context, context)

console.log({ nodes })