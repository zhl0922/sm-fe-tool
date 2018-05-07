"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = runReactComponentExample;

var _webpackMerge = _interopRequireDefault(require("webpack-merge"));

var _htmlWebpackPlugin = _interopRequireDefault(require("html-webpack-plugin"));

var _commands = require("../commands");

var _path = _interopRequireDefault(require("path"));

var _reactApp = _interopRequireDefault(require("../configs/react-app"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function runReactComponentExample(args) {
  return (0, _commands.runExample)(args, (0, _reactApp.default)());
}

module.exports = exports["default"];