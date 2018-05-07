"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createWebpackConfig;

var _webpack = _interopRequireDefault(require("webpack"));

var _webpackMerge = _interopRequireDefault(require("webpack-merge"));

var _copyWebpackPlugin = _interopRequireDefault(require("copy-webpack-plugin"));

var _miniCssExtractPlugin = _interopRequireDefault(require("mini-css-extract-plugin"));

var _compressionWebpackPlugin = _interopRequireDefault(require("compression-webpack-plugin"));

var _progressBarWebpackPlugin = _interopRequireDefault(require("progress-bar-webpack-plugin"));

var _autoprefixer = _interopRequireDefault(require("autoprefixer"));

var _happypack = _interopRequireDefault(require("happypack"));

var _path = _interopRequireDefault(require("path"));

var _chalk = _interopRequireDefault(require("chalk"));

var _createBabelConfig = _interopRequireDefault(require("./createBabelConfig"));

var _createResourceMap = _interopRequireDefault(require("./createResourceMap"));

var _utils = require("./utils");

var _constant = require("./constant");

var _os = _interopRequireDefault(require("os"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function createHappyInstance(extension, options) {
  const threadPool = _happypack.default.ThreadPool({
    size: _os.default.cpus().length - 1
  });

  const loader = {
    loader: (0, _utils.resolve)(`${extension}-loader`)
  };

  if (options) {
    loader.options = options;
  }

  return new _happypack.default({
    id: extension,
    loaders: [loader],
    threadPool: threadPool,
    verbose: false
  });
}

function createBabelRule() {
  return {
    test: /\.(js|jsx)$/,
    loader: (0, _utils.resolve)('happypack/loader'),
    options: {
      id: 'babel'
    },
    exclude: /node_modules/ // include: path.join(process.cwd(), 'client/src')

  };
}

function createStyleRules(options) {
  const {
    browsers,
    extractCss
  } = options;
  const cssLoader = {
    loader: (0, _utils.resolve)('happypack/loader'),
    options: {
      id: 'css'
    }
  };
  const postcssLoader = {
    loader: (0, _utils.resolve)('postcss-loader'),
    options: {
      plugins: function () {
        return [(0, _autoprefixer.default)({
          browsers
        })];
      }
    }
  };

  function generateLoaders(loader) {
    let loaders = [cssLoader, postcssLoader];

    if (loader) {
      loaders.push({
        loader: (0, _utils.resolve)('happypack/loader'),
        options: {
          id: loader
        }
      });
    }

    return [extractCss ? _miniCssExtractPlugin.default.loader : (0, _utils.resolve)('style-loader'), ...loaders];
  }

  const loaders = {
    css: generateLoaders(),
    less: generateLoaders('less')
  };
  let output = [];

  for (let extension in loaders) {
    let loader = loaders[extension];
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    });
  }

  return output;
}

function createBaseRules(isModule) {
  return [{
    test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
    loader: (0, _utils.resolve)('url-loader'),
    options: {
      limit: 10000,
      name: isModule ? 'assets/[name].[ext]' : 'img/[name].[hash:7].[ext]',
      fallback: (0, _utils.resolve)('file-loader')
    }
  }, {
    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
    loader: (0, _utils.resolve)('url-loader'),
    options: {
      limit: 10000,
      name: isModule ? 'assets/[name].[ext]' : 'fonts/[name].[hash:7].[ext]',
      fallback: (0, _utils.resolve)('file-loader')
    }
  }];
}

function createWebpackConfig(userConfig, buildConfig = {}) {
  const isProduction = process.env.NODE_ENV === 'production';
  const cwd = process.cwd();
  let {
    browsers = _constant.DEFAULT_BROWSERS,
    webpack: {
      entry: userEntry,
      library: userLibrary,
      libraryTarget: userLibraryTarget,
      publicPath = _constant.DEFAULT_PUBLIC_PATH,
      outputPath = _constant.DEFAULT_OUTPUT_PATH,
      resolve: userResolve,
      copy,
      define,
      extractCss,
      externals: userExternals,
      plugins: userPlugins = [],
      rules: userRules = [],
      noParse,
      gzip,
      config: userConfigFn
    }
  } = userConfig;

  let {
    babel: buildBabelConfig,
    entry: buildEntry = [],
    isModule,
    splitChunks,
    progress,
    resourceMap
  } = buildConfig,
      extraConfig = _objectWithoutProperties(buildConfig, ["babel", "entry", "isModule", "splitChunks", "progress", "resourceMap"]);

  if (!userEntry) {
    (0, _utils.error)('webpack.entry can not find');
    process.exit(1);
  }

  outputPath = _path.default.join(cwd, outputPath);
  let resolveConfig = {
    modules: ['node_modules'],
    extensions: ['.js', '.jsx', '.less', '.css']
  };

  if (userResolve) {
    resolveConfig = (0, _webpackMerge.default)(resolveConfig, userResolve);
  }

  let config = {
    mode: isProduction ? 'production' : 'development',
    entry: (0, _utils.processEntry)(userEntry, buildEntry),
    output: {
      path: outputPath,
      filename: 'js/[name].js',
      publicPath
    },
    resolve: resolveConfig,
    module: {
      rules: [createBabelRule(), ...createStyleRules({
        extractCss,
        browsers
      }), ...createBaseRules(isModule)]
    },
    plugins: [createHappyInstance('css', {
      minimize: isProduction
    }), createHappyInstance('less'), createHappyInstance('babel', _objectSpread({
      cacheDirectory: true,
      babelrc: false
    }, (0, _createBabelConfig.default)(userConfig, buildBabelConfig)))]
  };

  if (userLibrary) {
    config.output.library = userLibrary;
  }

  if (userLibraryTarget) {
    config.output.libraryTarget = userLibraryTarget;
  }

  if (splitChunks) {
    config.optimization = config.optimization || {};
    config.optimization.splitChunks = {
      cacheGroups: {
        vendors: {
          chunks: 'all',
          name: _constant.COMMON_CHUNK_NAME,
          test: /[\\/]node_modules[\\/]/,
          enforce: true
        }
      }
    };
    config.optimization.runtimeChunk = {
      name: _constant.RUNTIME_CHUNK_NAME
    };
  }

  if (progress) {
    config.plugins.push(new _progressBarWebpackPlugin.default({
      format: _chalk.default.cyan('building [:bar]:percent'),
      summary: false
    }));
  }

  if (noParse) {
    config.module.noParse = noParse;
  }

  if (define) {
    config.plugins.push(new _webpack.default.DefinePlugin(define));
  }

  if (extractCss) {
    config.plugins.push(new _miniCssExtractPlugin.default(isModule ? {
      filename: 'index.css'
    } : {
      filename: 'css/[name].[contenthash].css',
      chunkFilename: 'css/[name].[contenthash].css'
    }));
  }

  if (copy) {
    config.plugins.push(new _copyWebpackPlugin.default(copy));
  }

  if (gzip) {
    let gzipOps = {
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$'),
      threshold: 10240,
      minRatio: 0.8
    };

    if ((0, _utils.typeOf)(gzip) === 'object') {
      gzipOps = _objectSpread({}, gzipOps, {
        gzip
      });
    }

    config.plugins.push(new _compressionWebpackPlugin.default(gzipOps));
  }

  if (userExternals) {
    config.externals = config.externals || {};
    config.externals = _objectSpread({}, config.externals, userExternals);
  }

  config.plugins.push(...userPlugins);
  config.module.rules.push(...userRules);
  config = (0, _webpackMerge.default)(config, extraConfig);

  if (resourceMap) {
    config.plugins.push((0, _createResourceMap.default)(outputPath));
  }

  if ((0, _utils.typeOf)(userConfigFn) === 'function') {
    config = userConfigFn(config);

    if (!config) {
      (0, _utils.error)('webpack.config() must return the webpack config object');
      process.exit(1);
    }
  }

  return config;
}

module.exports = exports["default"];