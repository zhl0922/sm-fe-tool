'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = createBuildWebpackConfig;

var _webpackMerge = require('webpack-merge');

var _webpackMerge2 = _interopRequireDefault(_webpackMerge);

var _createWebpackConfig = require('./createWebpackConfig');

var _createWebpackConfig2 = _interopRequireDefault(_createWebpackConfig);

var _constant = require('./constant');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
function createBuildWebpackConfig(userConfig, externalConfig = {}) {
    let buildConfig = {
        // devtool: '#source-map',
        output: {
            filename: 'js/[name].[chunkhash].js',
            chunkFilename: 'js/[name].[chunkhash].js'
        },
        optimization: {
            concatenateModules: true,
            splitChunks: {
                cacheGroups: {
                    vendors: {
                        chunks: 'all',
                        name: _constant.COMMON_CHUNK_NAME,
                        test: /[\\/]node_modules[\\/]/,
                        enforce: true
                    }
                }
            },
            runtimeChunk: {
                name: _constant.RUNTIME_CHUNK_NAME
            }
            /* minimizer: [
                new UglifyJsPlugin({
                    uglifyOptions: {
                        parallel: true
                    }
                })
            ] */
        }
        /* plugins: [
            new UglifyJsPlugin({
                sourceMap: true,
                parallel: true
            })
        ], */
    };
    buildConfig = (0, _webpackMerge2.default)(buildConfig, externalConfig);
    return (0, _createWebpackConfig2.default)(userConfig, buildConfig);
}
module.exports = exports['default'];