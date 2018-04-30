'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = build;

var _user = require('../user');

var _constant = require('../constant');

var _buildReactApp = require('./build-react-app');

var _buildReactApp2 = _interopRequireDefault(_buildReactApp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const commandsMap = {
    [_constant.REACT_APP]: _buildReactApp2.default
};

function build(args) {
    const projectType = (0, _user.getProjectType)(args);
    commandsMap[projectType](args);
}
module.exports = exports['default'];