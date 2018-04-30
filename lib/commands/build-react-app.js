'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = buildReactApp;

var _webpackBuild = require('../webpackBuild');

var _webpackBuild2 = _interopRequireDefault(_webpackBuild);

var _reactApp = require('../configs/react-app');

var _reactApp2 = _interopRequireDefault(_reactApp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function buildReactApp(args) {
    return (0, _webpackBuild2.default)(args, (0, _reactApp2.default)());
}
module.exports = exports['default'];