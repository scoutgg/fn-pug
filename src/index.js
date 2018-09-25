import {parseExpression} from '@babel/parser'
import {parse as babelParser} from '@babel/core'
import optionalChaining from '@babel/plugin-proposal-optional-chaining'
import lex from 'pug-lexer'
import parse from 'pug-parser'
import compile from './compiler'

export default function pug(src, opts) {
  var lexerOpts = {
    plugins: [
      {
        isExpression: function(...args) {
          try {
            babelParser(args[1])
          } catch(e) {
            return false
          }
          return true
        }
      }
    ]
  }
  return compile(parse(lex(src, lexerOpts), opts = Object.assign({src}, opts)), opts)
}

export function compileClient(code, runtime) {
  return Function(['$$'], 'return ' + pug(code).code)(runtime)
}
