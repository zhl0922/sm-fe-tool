"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = buildReactApp;

var _commands = require("../commands");

var _reactApp = _interopRequireDefault(require("../configs/react-app"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function buildReactApp(args) {
  return (0, _commands.build)(args, (0, _reactApp.default)());
}

module.exports = exports["default"];