"use strict";

exports.__esModule = true;
exports.default = transformContext;

var _transform = require("@babel/core/lib/transform");

var _types = require("@babel/types");

var _globals = require("globals");

var _pluginProposalOptionalChaining = _interopRequireDefault(require("@babel/plugin-proposal-optional-chaining"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const GLOBALS = Object.assign(Object.create(null), _globals.builtin, _globals.browser, _globals.commonjs);
delete GLOBALS.name;
delete GLOBALS.constructor;
delete GLOBALS.open;
delete GLOBALS.event;
delete GLOBALS.close;
delete GLOBALS.closed;
delete GLOBALS.parent;
delete GLOBALS.print;
delete GLOBALS.screen;
console.log(GLOBALS);

function transformContext(code, map) {
  map = JSON.parse(map.toString());
  return (0, _transform.transform)(code, {
    inputSourceMap: map,
    plugins: [_pluginProposalOptionalChaining.default, function transform() {
      return {
        visitor: {
          AssignmentExpression(path) {
            var node = path.node.left;
            var parents = [];

            while (node.object) {
              parents.push(node);
              node = node.object;
            }

            if (node.name in GLOBALS) return;
            if (path.scope.hasBinding(node.name)) return;
            if (node.name === 'this') return;
            var parent = parents.pop();

            if (parent) {
              parent.object = (0, _types.memberExpression)((0, _types.identifier)('this'), node);
            } else {
              path.node.left = (0, _types.memberExpression)((0, _types.identifier)('this'), node);
            }

            path.replaceWith(path.node);
          },

          CallExpression(path) {
            var {
              node,
              scope
            } = path;
            if (node.callee.type !== 'Identifier') return;
            if (node.callee.name in GLOBALS) return;
            if (path.scope.hasBinding(node.callee.name)) return;
            if (node.callee.name === 'this') return;
            if (node.callee.name === '$$') return;
            node.callee = (0, _types.memberExpression)((0, _types.identifier)('this'), node.callee);
          },

          ReferencedIdentifier(path) {
            var {
              node,
              scope
            } = path;
            if (node.name in GLOBALS) return;
            if (path.scope.hasBinding(node.name)) return;
            if (node.name === 'this') return;
            if (node.name === '$$') return;
            scope.push((0, _types.variableDeclarator)((0, _types.identifier)(node.name), (0, _types.memberExpression)((0, _types.identifier)('this'), (0, _types.identifier)(node.name))));
          }

        }
      };
    }]
  });
}