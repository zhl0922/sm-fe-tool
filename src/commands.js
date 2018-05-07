import chalk from 'chalk';
import merge from 'webpack-merge';
import webpack from 'webpack';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin';

import webpackBuild from './webpackBuild';
import webpackDevServer from './webpackDevServer';
import { DEFAULT_DEV_SERVER_PORT, DEFAULT_DEV_SERVER_HOST } from './constant';
import { resolve } from './utils';


function getHMRClientEntries(host, port) {
    const hmrURL = `http://${host}:${port}/`;
    return [
        `${resolve('webpack-dev-server/client/')}?${hmrURL}`,
        resolve('webpack/hot/dev-server')
    ];
}

function createBuildConfig() {
    return {
        splitChunks: true,
        progress: true,
        resourceMap: true,
        output: {
            filename: 'js/[name].[chunkhash].js',
            chunkFilename: 'js/[name].[chunkhash].js'
        },
        optimization: {
            concatenateModules: true,
        },
    };
}

export function build(args, commandConfig = {}) {
    let config = createBuildConfig();
    return webpackBuild(args, merge(config, commandConfig));
}

export function run(args, commandConfig = {}) {
    const host = DEFAULT_DEV_SERVER_HOST;
    let { port = DEFAULT_DEV_SERVER_PORT } = args;
    const serverConfig = { host, port };

    let config = createServerConfig(serverConfig);

    return webpackDevServer(args, serverConfig, merge(config, commandConfig));
}

export function runExample(args, commandConfig = {}) {
    const host = DEFAULT_DEV_SERVER_HOST;
    let { port = DEFAULT_DEV_SERVER_PORT } = args;
    const serverConfig = { host, port };
    const cwd = process.cwd();
    let config = createServerConfig(serverConfig);

    config = merge(config, {
        resourceMap: false,
        plugins: [
            new HtmlWebpackPlugin({
                title: 'react component example',
                template: path.join(__dirname, '../templates/webpack_template.html'),
                filename: 'index.html'
            })
        ]
    });
    return webpackDevServer(args, serverConfig, userConfig => {
        userConfig.webpack.entry = { app: path.join(cwd, 'example/index.js') };
        delete userConfig.webpack.libraryTarget;
        delete userConfig.webpack.library;
        return merge(config, commandConfig);
    });
}

export function buildWebModule(args, commandConfig = {}) {
    return webpackBuild(args, userConfig => {
        const cwd = process.cwd();
        userConfig.webpack.entry = { index: path.join(cwd, 'src/index.js') };
        if (!userConfig.webpack.libraryTarget) {
            userConfig.webpack.libraryTarget = 'commonjs2';
        }
        let config = {
            isModule: true,
            progress: true,
            output: {
                filename: 'index.js',
                publicPath: './'
            },
            optimization: {
                concatenateModules: true,
            },
        };
        return merge(config, commandConfig);
    });
}

function createServerConfig(serverConfig) {

    const { host, port } = serverConfig;
    let publicPath = `http://${host}:${port}/`;
    return {
        progress: true,
        resourceMap: true,

        entry: getHMRClientEntries(host, port),
        output: {
            publicPath
        },
        devtool: '#cheap-module-source-map',

        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new FriendlyErrorsPlugin({
                compilationSuccessInfo: {
                    messages: [`app is running at ${publicPath}`],
                }
            })
        ],
        optimization: {
            noEmitOnErrors: true
        },
    }
}