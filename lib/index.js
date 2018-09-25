"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = pug;
exports.compileClient = compileClient;

var _pugLexer = _interopRequireDefault(require("pug-lexer"));

var _pugParser = _interopRequireDefault(require("pug-parser"));

var _compiler = _interopRequireDefault(require("./compiler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import {parseExpression} from '@babel/parser'
// import {parse as babelParser} from '@babel/core'
// import optionalChaining from '@babel/plugin-proposal-optional-chaining'
function pug(src, opts) {
  var lexerOpts = {
    plugins: [{
      isExpression: function (...args) {
        try {
          babelParser(args[1]);
        } catch (e) {
          return false;
        }

        return true;
      }
    }]
  };
  return (0, _compiler.default)((0, _pugParser.default)((0, _pugLexer.default)(src, lexerOpts), opts = Object.assign({
    src
  }, opts)), opts);
}

function compileClient(code, runtime) {
  return Function(['$$'], 'return ' + pug(code).code)(runtime);
}