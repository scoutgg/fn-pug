"use strict";

exports.__esModule = true;
exports.default = pug;
exports.compileClient = compileClient;

var _pugLexer = _interopRequireDefault(require("pug-lexer"));

var _pugParser = _interopRequireDefault(require("pug-parser"));

var _compiler = _interopRequireDefault(require("./compiler"));

var _parser = require("@babel/parser");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function pug(src, opts) {
  var lexerOpts = {
    plugins: [{
      isExpression: function (...args) {
        try {
          (0, _parser.parseExpression)(args[1], {
            sourceType: "module",
            plugins: ['optionalChaining']
          });
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