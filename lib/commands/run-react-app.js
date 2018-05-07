"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = runReactApp;

var _commands = require("../commands");

var _reactApp = _interopRequireDefault(require("../configs/react-app"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function runReactApp(args) {
  return (0, _commands.run)(args, (0, _reactApp.default)());
}

module.exports = exports["default"];