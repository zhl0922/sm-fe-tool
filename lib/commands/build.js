"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = build;

var _user = require("../user");

var _constant = require("../constant");

var _buildReactApp = _interopRequireDefault(require("./build-react-app"));

var _buildReactComponent = _interopRequireDefault(require("./build-react-component"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const commandsMap = {
  [_constant.REACT_APP]: _buildReactApp.default,
  [_constant.REACT_COMPONENT]: _buildReactComponent.default
};

function build(args) {
  const projectType = (0, _user.getProjectType)(args);

  if (!commandsMap[projectType]) {
    error(`[${projectType}] does not have this command`);
    process.exit(1);
  }

  commandsMap[projectType](args);
}

module.exports = exports["default"];