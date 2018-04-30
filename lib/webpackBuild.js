'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; // import ora from 'ora';


exports.default = webpackBuild;

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _rimraf = require('rimraf');

var _rimraf2 = _interopRequireDefault(_rimraf);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _progressBarWebpackPlugin = require('progress-bar-webpack-plugin');

var _progressBarWebpackPlugin2 = _interopRequireDefault(_progressBarWebpackPlugin);

var _createBuildWebpackConfig = require('./createBuildWebpackConfig');

var _createBuildWebpackConfig2 = _interopRequireDefault(_createBuildWebpackConfig);

var _user = require('./user');

var _utils = require('./utils');

var _constant = require('./constant');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function webpackBuild(args, externalConfig) {
    process.env.NODE_ENV = 'production';
    const cwd = process.cwd();

    const userConfig = (0, _user.getUserConfig)(args);
    /* const spinner = ora({
        spinner: 'line',
        text: chalk.cyan('building...')
    }).start(); */

    const webpackConfig = (0, _createBuildWebpackConfig2.default)(userConfig, _extends({
        plugins: [new _progressBarWebpackPlugin2.default({
            format: _chalk2.default.cyan('building [:bar]:percent'),
            summary: false
        })]
    }, externalConfig));
    // console.log(JSON.stringify(webpackConfig, null, 4))

    const {
        webpack: {
            outputPath = _constant.DEFAULT_OUTPUT_PATH
        }
    } = userConfig;
    let compiler = (0, _webpack2.default)(webpackConfig);
    return new Promise((resolve, reject) => {
        (0, _rimraf2.default)(_path2.default.join(cwd, outputPath), err => {
            if (err) throw err;
            compiler.run((err, stats) => {
                // spinner.stop();
                if (err) {
                    (0, _utils.error)(err.stack || err);
                    if (err.details) {
                        (0, _utils.error)(err.details);
                    }
                    process.exit(1);
                }

                const statsOps = {
                    colors: true,
                    modules: false,
                    children: false,
                    chunks: false,
                    chunkModules: false
                };

                const json = stats.toJson(statsOps);
                const string = stats.toString(statsOps);

                if (stats.hasErrors()) {
                    (0, _utils.error)(json.errors);
                    (0, _utils.error)('  Build failed with errors.\n');
                    process.exit(1);
                }
                process.stdout.write(string + '\n\n');
            });
        });
    });
}
module.exports = exports['default'];