'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = runReactApp;

var _webpackDevServer = require('../webpackDevServer');

var _webpackDevServer2 = _interopRequireDefault(_webpackDevServer);

var _reactApp = require('../configs/react-app');

var _reactApp2 = _interopRequireDefault(_reactApp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function runReactApp(args) {
    return (0, _webpackDevServer2.default)(args, (0, _reactApp2.default)());
}
module.exports = exports['default'];