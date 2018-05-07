"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _utils = require("../utils");

function _default() {
  return {
    babel: {
      runtime: true,
      dynamicImport: true,
      presets: [(0, _utils.resolve)('@babel/preset-react')],
      plugins: [(0, _utils.resolve)('babel-plugin-transform-react-remove-prop-types')]
    }
  };
}

module.exports = exports["default"];