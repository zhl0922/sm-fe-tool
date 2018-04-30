'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = createDevWebpackConfig;

var _webpackMerge = require('webpack-merge');

var _webpackMerge2 = _interopRequireDefault(_webpackMerge);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _createWebpackConfig = require('./createWebpackConfig');

var _createWebpackConfig2 = _interopRequireDefault(_createWebpackConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createDevWebpackConfig(userConfig, externalConfig = {}) {
    let devConfig = {
        devtool: '#cheap-module-source-map',
        optimization: {
            noEmitOnErrors: true
        },
        plugins: [new _webpack2.default.HotModuleReplacementPlugin()]
    };
    devConfig = (0, _webpackMerge2.default)(devConfig, externalConfig);
    return (0, _createWebpackConfig2.default)(userConfig, devConfig);
}
module.exports = exports['default'];