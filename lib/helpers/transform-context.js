"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = transformContext;

var _core = require("@babel/core");

var _globals = require("globals");

const {
  memberExpression,
  variableDeclarator,
  identifier
} = _core.types;
const GLOBALS = Object.assign(Object.create(null), _globals.builtin, _globals.browser, _globals.commonjs);
delete GLOBALS.name;
delete GLOBALS.constructor;
delete GLOBALS.open;

function transformContext(code, map) {
  map = JSON.parse(map.toString());
  return (0, _core.transform)(code, {
    inputSourceMap: map,
    plugins: [function transform() {
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
              parent.object = memberExpression(identifier('this'), node);
            } else {
              path.node.left = memberExpression(identifier('this'), node);
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
            node.callee = memberExpression(identifier('this'), node.callee);
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
            scope.push(variableDeclarator(identifier(node.name), memberExpression(identifier('this'), identifier(node.name))));
          }

        }
      };
    }]
  });
}