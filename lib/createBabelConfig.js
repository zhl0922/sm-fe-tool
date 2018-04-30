'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = createBabelConfig;

var _webpackMerge = require('webpack-merge');

var _webpackMerge2 = _interopRequireDefault(_webpackMerge);

var _constant = require('./constant');

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createBabelConfig(userConfig, externalConfig = {}) {
    const {
        type,
        babel: {
            plugins: userPlugins = [],
            presets: userPresets = [],
            stage: userStage,
            config: userConfigFn
        },
        browsers = _constant.DEFAULT_BROWSERS
    } = userConfig;

    let plugins = [];
    let presets = [];

    presets.push([(0, _utils.resolve)('babel-preset-env'), {
        modules: false,
        targets: {
            browsers
        }
    }]);
    plugins.push((0, _utils.resolve)('babel-plugin-transform-runtime'));
    plugins.push((0, _utils.resolve)('babel-plugin-syntax-dynamic-import'));

    let stage = userStage != null ? userStage : _constant.DEFAULT_STAGE;
    if ((0, _utils.typeOf)(stage) === 'number') {
        presets.push((0, _utils.resolve)(`babel-preset-stage-${stage}`));
        if (stage <= 2) {
            plugins.push((0, _utils.resolve)('babel-plugin-transform-decorators-legacy'));
        }
    }

    presets = [...presets, ...userPresets];
    plugins = [...plugins, ...userPlugins];

    let config = {
        presets,
        plugins,
        // comments: false,
        babelrc: false
    };

    config = (0, _webpackMerge2.default)(config, externalConfig);

    if ((0, _utils.typeOf)(userConfigFn) === 'function') {
        config = userConfigFn(config);
        if (!config) {
            (0, _utils.error)('babel.config() must return the babel config object');
            process.exit(1);
        }
    }

    return config;
}
module.exports = exports['default'];