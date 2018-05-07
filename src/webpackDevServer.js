import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import createWebpackConfig from './createWebpackConfig';
import { getUserConfig } from './user';
import { error, typeOf } from './utils';


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

export default function webpackDevServer(args, serverConfig, buildConfig) {
    process.env.NODE_ENV = 'development';

    const userConfig = getUserConfig(args);

    if (typeOf(buildConfig) === 'function') {
        buildConfig = buildConfig(userConfig);
    }
    
    const webpackConfig = createWebpackConfig(userConfig, buildConfig);

    if (userConfig.webpack.publicPath) {
        webpackConfig.output.publicPath = userConfig.webpack.publicPath;
    }
    // console.log(JSON.stringify(webpackConfig, null, 4))

    devServer(webpackConfig, serverConfig);
}