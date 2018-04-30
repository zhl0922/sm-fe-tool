'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = devServer;

var _user = require('../user');

var _constant = require('../constant');

var _runReactApp = require('./run-react-app');

var _runReactApp2 = _interopRequireDefault(_runReactApp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const commandsMap = {
    [_constant.REACT_APP]: _runReactApp2.default
};

function devServer(args) {
    const projectType = (0, _user.getProjectType)(args);
    commandsMap[projectType](args);
}
module.exports = exports['default'];