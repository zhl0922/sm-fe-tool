"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = devServer;

var _user = require("../user");

var _constant = require("../constant");

var _utils = require("../utils");

var _runReactApp = _interopRequireDefault(require("./run-react-app"));

var _runReactComponent = _interopRequireDefault(require("./run-react-component"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const commandsMap = {
  [_constant.REACT_APP]: _runReactApp.default,
  [_constant.REACT_COMPONENT]: _runReactComponent.default
};

function devServer(args) {
  const projectType = (0, _user.getProjectType)(args);

  if (!commandsMap[projectType]) {
    (0, _utils.error)(`[${projectType}] does not have this command`);
    process.exit(1);
  }

  commandsMap[projectType](args);
}

module.exports = exports["default"];