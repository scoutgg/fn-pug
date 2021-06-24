import fs from 'fs'
import fnPug from '../index.js'

const root = 'fn-pug/lib/runtime'

export default function pugPlugin(options = {}) {
  return {
    name: 'pug',
    setup(build) {
      async function onLoad(template) {
        const filename = template.path
        const src = fs.readFileSync(filename, { encoding: 'utf-8' })

        const RUNTIMES = {
          'dom': `require('${root}/dom').default(document)`,
          'string': `require('${root}/string').default()`,
          'virtual-dom': `require('${root}/vdom').default(require('virtual-dom/h'))`,
          'snabbdom': `require('${root}/snabb').default(require('snabbdom/h').default)`,
          'react': `require('${root}/react').default(require('react'))`,
          'vue': `require('${root}/vue').default()`
        }

        const runtime = RUNTIMES[options.runtime || 'virtual-dom'] || options.runtime

        const contents = []
        const header =`var $$ = ${runtime}`
        const tpl = fnPug(src, { filename })
        const footer = 'export default template'
        const module = [header, tpl.code, footer].join('\n')
        contents.push(Buffer.from(module))
        const content = Buffer.concat(contents).toString()

        return {
          contents: content,
          loader: 'js',
        }
      }

      build.onLoad({ filter: /\.(pug|jade)$/ }, onLoad)
    },
  }
}
