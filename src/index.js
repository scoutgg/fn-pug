import lex from 'pug-lexer'
import parse from 'pug-parser'
import compile from './compiler'

export default function pug(src, opts) {
  var lexerOpts = {
    plugins: []
  }
  return compile(parse(lex(src, lexerOpts), opts = Object.assign({src}, opts)), opts)
}

export function compileClient(code, runtime) {
  return Function(['$$'], 'return ' + pug(code).code)(runtime)
}
