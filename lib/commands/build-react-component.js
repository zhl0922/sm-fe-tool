"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = buildReactComponent;

var _commands = require("../commands");

var _utils = require("../utils");

function buildReactComponent(args) {
  let config = {
    babel: {
      presets: [(0, _utils.resolve)('@babel/preset-react')]
    },
    externals: {
      react: {
        commonjs: 'react',
        commonjs2: 'react',
        amd: 'React',
        root: 'React'
      },
      'react-dom': {
        commonjs: 'react-dom',
        commonjs2: 'react-dom',
        amd: 'ReactDOM',
        root: 'ReactDOM'
      }
    }
  };
  return (0, _commands.buildWebModule)(args, config);
}

module.exports = exports["default"];