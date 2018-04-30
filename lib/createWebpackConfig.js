'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = createWebpackConfig;

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _webpackMerge = require('webpack-merge');

var _webpackMerge2 = _interopRequireDefault(_webpackMerge);

var _copyWebpackPlugin = require('copy-webpack-plugin');

var _copyWebpackPlugin2 = _interopRequireDefault(_copyWebpackPlugin);

var _miniCssExtractPlugin = require('mini-css-extract-plugin');

var _miniCssExtractPlugin2 = _interopRequireDefault(_miniCssExtractPlugin);

var _compressionWebpackPlugin = require('compression-webpack-plugin');

var _compressionWebpackPlugin2 = _interopRequireDefault(_compressionWebpackPlugin);

var _autoprefixer = require('autoprefixer');

var _autoprefixer2 = _interopRequireDefault(_autoprefixer);

var _happypack = require('happypack');

var _happypack2 = _interopRequireDefault(_happypack);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _createBabelConfig = require('./createBabelConfig');

var _createBabelConfig2 = _interopRequireDefault(_createBabelConfig);

var _createResourceMap = require('./createResourceMap');

var _createResourceMap2 = _interopRequireDefault(_createResourceMap);

var _utils = require('./utils');

var _constant = require('./constant');

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function createHappyInstance(extension, options) {
    const threadPool = _happypack2.default.ThreadPool({ size: _os2.default.cpus().length - 1 });
    const loader = {
        loader: (0, _utils.resolve)(`${extension}-loader`)
    };
    if (options) {
        loader.options = options;
    }
    return new _happypack2.default({
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
        exclude: /node_modules/
        // include: path.join(process.cwd(), 'client/src')
    };
}

function createStyleRules(options) {
    const {
        browsers,
        extractCss
    } = options;
    const cssLoader = {
        loader: (0, _utils.resolve)('happypack/loader'),
        options: { id: 'css' }
    };
    const postcssLoader = {
        loader: (0, _utils.resolve)('postcss-loader'),
        options: {
            plugins: function () {
                return [(0, _autoprefixer2.default)({ browsers })];
            }
        }
    };
    function generateLoaders(loader) {
        let loaders = [cssLoader, postcssLoader];
        if (loader) {
            loaders.push({
                loader: (0, _utils.resolve)('happypack/loader'),
                options: { id: loader }
            });
        }
        return [extractCss ? _miniCssExtractPlugin2.default.loader : (0, _utils.resolve)('style-loader'), ...loaders];
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

function createBaseRules() {
    return [{
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: (0, _utils.resolve)('url-loader'),
        options: {
            limit: 10000,
            name: 'img/[name].[hash:7].[ext]',
            fallback: (0, _utils.resolve)('file-loader')
        }
    }, {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: (0, _utils.resolve)('url-loader'),
        options: {
            limit: 10000,
            name: 'fonts/[name].[hash:7].[ext]',
            fallback: (0, _utils.resolve)('file-loader')
        }
    }];
}
function createWebpackConfig(userConfig, externalConfig = {}) {
    const isProduction = process.env.NODE_ENV === 'production';
    const cwd = process.cwd();
    let {
        browsers = _constant.DEFAULT_BROWSERS,
        webpack: {
            entry: userEntry,
            publicPath = _constant.DEFAULT_PUBLIC_PATH,
            outputPath = _constant.DEFAULT_OUTPUT_PATH,
            alias,
            copy,
            define,
            extractCss = true,
            externals,
            extensions,
            plugins: userPlugins = [],
            rules: userRules = [],
            noParse,
            gzip,
            config: userConfigFn
        }
    } = userConfig;

    let {
        babel,
        entry: externalEntry = [],
        output: externalOutput
    } = externalConfig,
        otherExternalConfig = _objectWithoutProperties(externalConfig, ['babel', 'entry', 'output']);

    extractCss = isProduction && extractCss;

    if (!userEntry) {
        (0, _utils.error)('webpack.entry can not find');
        process.exit(1);
    }
    const entry = (0, _utils.processEntry)(userEntry, externalEntry);

    outputPath = _path2.default.join(cwd, outputPath);

    const output = {
        path: outputPath,
        filename: 'js/[name].js',
        publicPath
    };

    let resolveConfig = { extensions: ['.js', '.jsx', '.less', '.css'] };
    if (extensions) {
        resolveConfig.extensions = [...resolveConfig, extensions];
    }
    if (alias) {
        resolveConfig.alias = alias;
    }

    let config = {
        mode: isProduction ? 'production' : 'development',
        entry,
        output: _extends({}, output, externalOutput),
        resolve: resolveConfig,
        module: {
            rules: [createBabelRule(), ...createStyleRules({
                extractCss,
                browsers
            }), ...createBaseRules()]
        },
        plugins: [createHappyInstance('css', { minimize: isProduction }), createHappyInstance('less'), createHappyInstance('babel', _extends({
            cacheDirectory: true
        }, (0, _createBabelConfig2.default)(userConfig, babel)))]
    };

    config = (0, _webpackMerge2.default)(config, otherExternalConfig);

    if (noParse) {
        config.module.noParse = noParse;
    }

    if (define) {
        config.plugins.push(new _webpack2.default.DefinePlugin(define));
    }

    if (extractCss) {
        config.plugins.push(new _miniCssExtractPlugin2.default({
            filename: 'css/[name].[contenthash].css',
            chunkFilename: 'css/[name].[contenthash].css'
        }));
    }

    if (copy) {
        config.plugins.push(new _copyWebpackPlugin2.default(copy));
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
            gzipOps = _extends({}, gzipOps, { gzip });
        }
        config.plugins.push(new _compressionWebpackPlugin2.default(gzipOps));
    }

    if (externals) {
        config.externals = externals;
    }

    config.plugins.push(...userPlugins);
    config.module.rules.push(...userRules);

    config.plugins.push((0, _createResourceMap2.default)(outputPath));

    if ((0, _utils.typeOf)(userConfigFn) === 'function') {
        config = userConfigFn(config);
        if (!config) {
            (0, _utils.error)('webpack.config() must return the webpack config object');
            process.exit(1);
        }
    }

    return config;
}
module.exports = exports['default'];