'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = webpackDevServer;

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _webpackDevServer = require('webpack-dev-server');

var _webpackDevServer2 = _interopRequireDefault(_webpackDevServer);

var _friendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

var _friendlyErrorsWebpackPlugin2 = _interopRequireDefault(_friendlyErrorsWebpackPlugin);

var _progressBarWebpackPlugin = require('progress-bar-webpack-plugin');

var _progressBarWebpackPlugin2 = _interopRequireDefault(_progressBarWebpackPlugin);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _createDevWebpackConfig = require('./createDevWebpackConfig');

var _createDevWebpackConfig2 = _interopRequireDefault(_createDevWebpackConfig);

var _user = require('./user');

var _utils = require('./utils');

var _constant = require('./constant');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function devServer(webpackConfig, serverConfig) {

    const { host, port } = serverConfig;

    const webpackDevServerOptions = {
        clientLogLevel: 'warning',
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        hot: true,
        // hotOnly: true,
        overlay: {
            warnings: false,
            errors: true
        },
        publicPath: webpackConfig.output.publicPath,
        quiet: true,
        inline: true,
        compress: true,
        watchOptions: {
            poll: false
        }
    };

    const compiler = (0, _webpack2.default)(webpackConfig);
    const server = new _webpackDevServer2.default(compiler, webpackDevServerOptions);

    server.listen(port, host, err => {
        if (err) {
            (0, _utils.error)('server start failed' + err);
            process.exit(1);
        }
    });
}

function getHMRClientEntries(host, port) {
    const hmrURL = `http://${host}:${port}/`;
    return [`${(0, _utils.resolve)('webpack-dev-server/client/')}?${hmrURL}`, (0, _utils.resolve)('webpack/hot/dev-server')];
}

function webpackDevServer(args, externalConfig) {
    process.env.NODE_ENV = 'development';
    const cwd = process.cwd();
    const userConfig = (0, _user.getUserConfig)(args);
    const host = _constant.DEFAULT_DEV_SERVER_HOST;

    let {
        publicPath,
        args: {
            port = _constant.DEFAULT_DEV_SERVER_PORT
        }
    } = userConfig;

    publicPath = publicPath || `http://${host}:${port}/`;
    const webpackConfig = (0, _createDevWebpackConfig2.default)(userConfig, _extends({
        entry: getHMRClientEntries(host, port),
        output: {
            publicPath
        },
        plugins: [new _progressBarWebpackPlugin2.default({
            format: _chalk2.default.cyan('building [:bar]:percent'),
            summary: false
        }), new _friendlyErrorsWebpackPlugin2.default({
            compilationSuccessInfo: {
                messages: [`app is running at ${publicPath}`]
            }
        })]
    }, externalConfig));

    devServer(webpackConfig, {
        port,
        host: _constant.DEFAULT_DEV_SERVER_HOST
    });
}
module.exports = exports['default'];