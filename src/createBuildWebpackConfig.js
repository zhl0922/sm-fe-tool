import merge from 'webpack-merge';
// import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import createWebpackConfig from './createWebpackConfig';
import { COMMON_CHUNK_NAME, RUNTIME_CHUNK_NAME } from './constant';
export default function createBuildWebpackConfig(userConfig, externalConfig = {}) {
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
                        name: COMMON_CHUNK_NAME,
                        test: /[\\/]node_modules[\\/]/,
                        enforce: true
                    }
                }
            },
            runtimeChunk: {
                name: RUNTIME_CHUNK_NAME,
            },
            /* minimizer: [
                new UglifyJsPlugin({
                    uglifyOptions: {
                        parallel: true
                    }
                })
            ] */
        },
        /* plugins: [
            new UglifyJsPlugin({
                sourceMap: true,
                parallel: true
            })
        ], */
    };
    buildConfig = merge(buildConfig, externalConfig);
    return createWebpackConfig(userConfig, buildConfig);
}