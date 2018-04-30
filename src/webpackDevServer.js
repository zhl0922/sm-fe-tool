import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';
import chalk from 'chalk';
import path from 'path';
import createDevWebpackConfig from './createDevWebpackConfig';
import { getUserConfig } from './user';
import { error, info, resolve } from './utils';
import { DEFAULT_DEV_SERVER_PORT, DEFAULT_DEV_SERVER_HOST } from './constant';

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

    const compiler = webpack(webpackConfig);
    const server = new WebpackDevServer(compiler, webpackDevServerOptions);

    server.listen(port, host, (err) => {
        if (err) {
            error('server start failed' + err);
            process.exit(1);
        }
    })
}

function getHMRClientEntries(host, port) {
    const hmrURL = `http://${host}:${port}/`;
    return [
        `${resolve('webpack-dev-server/client/')}?${hmrURL}`,
        resolve('webpack/hot/dev-server')
    ];
}

export default function webpackDevServer(args, externalConfig) {
    process.env.NODE_ENV = 'development';
    const cwd = process.cwd();
    const userConfig = getUserConfig(args);
    const host = DEFAULT_DEV_SERVER_HOST;

    let {
        publicPath,
        args: {
            port = DEFAULT_DEV_SERVER_PORT
        }
    } = userConfig;

    publicPath = publicPath || `http://${host}:${port}/`;
    const webpackConfig = createDevWebpackConfig(userConfig, {
        entry: getHMRClientEntries(host, port),
        output: {
            publicPath
        },
        plugins: [
            new ProgressBarPlugin({
                format: chalk.cyan('building [:bar]:percent'),
                summary: false
            }),
            new FriendlyErrorsPlugin({
                compilationSuccessInfo: {
                    messages: [`app is running at ${publicPath}`],
                }
            })
        ],
        ...externalConfig
    });

    devServer(webpackConfig, {
        port,
        host: DEFAULT_DEV_SERVER_HOST
    });
}