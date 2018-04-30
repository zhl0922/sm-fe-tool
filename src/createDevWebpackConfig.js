import merge from 'webpack-merge';
import webpack from 'webpack';
import createWebpackConfig from './createWebpackConfig';
export default function createDevWebpackConfig(userConfig, externalConfig = {}) {
    let devConfig = {
        devtool: '#cheap-module-source-map',
        optimization: {
            noEmitOnErrors: true
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin()
        ],
    };
    devConfig = merge(devConfig, externalConfig);
    return createWebpackConfig(userConfig, devConfig);
}