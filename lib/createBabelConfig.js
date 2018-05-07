"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createBabelConfig;

var _webpackMerge = _interopRequireDefault(require("webpack-merge"));

var _constant = require("./constant");

var _utils = require("./utils");

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

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

  const {
    runtime,
    dynamicImport
  } = externalConfig,
        otherExternalConfig = _objectWithoutProperties(externalConfig, ["runtime", "dynamicImport"]);

  presets.push([(0, _utils.resolve)('@babel/preset-env'), {
    modules: false,
    targets: {
      browsers
    }
  }]);

  if (runtime) {
    plugins.push([(0, _utils.resolve)('@babel/plugin-transform-runtime'), {
      moduleName: _path.default.dirname((0, _utils.resolve)('@babel/runtime/package'))
    }]);
  }

  if (dynamicImport) {
    plugins.push((0, _utils.resolve)('@babel/plugin-syntax-dynamic-import'));
  }

  let stage = userStage != null ? userStage : _constant.DEFAULT_STAGE;

  if ((0, _utils.typeOf)(stage) === 'number') {
    const stagePlugin = (0, _utils.resolve)(`@babel/preset-stage-${stage}`);

    if (stage <= 2) {
      presets.push([stagePlugin, {
        decoratorsLegacy: true
      }]); // plugins.push(resolve('babel-plugin-transform-decorators-legacy'));
    } else {
      presets.push(stagePlugin);
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
  config = (0, _webpackMerge.default)(config, otherExternalConfig);

  if ((0, _utils.typeOf)(userConfigFn) === 'function') {
    config = userConfigFn(config);

    if (!config) {
      (0, _utils.error)('babel.config() must return the babel config object');
      process.exit(1);
    }
  }

  return config;
}

module.exports = exports["default"];