// import ora from 'ora';
import webpack from 'webpack';
import rm from 'rimraf';
import path from 'path';
import chalk from 'chalk';
import createWebpackConfig from './createWebpackConfig';
import { getUserConfig } from './user';
import { error, info, typeOf } from './utils';
export default function webpackBuild(args, buildConfig) {
    process.env.NODE_ENV = 'production';

    const userConfig = getUserConfig(args);

    if (typeOf(buildConfig) === 'function') {
        buildConfig = buildConfig(userConfig);
    }

    const webpackConfig = createWebpackConfig(userConfig, buildConfig);
    // console.log(webpackConfig)
    
    let compiler = webpack(webpackConfig);

    return new Promise((resolve, reject) => {
        rm(webpackConfig.output.path, err => {
            if (err) throw err;
            compiler.run((err, stats) => {
                if (err) {
                    error(err.stack || err);
                    if (err.details) {
                        error(err.details);
                    }
                    process.exit(1);
                }

                const statsOps = {
                    colors: true,
                    modules: false,
                    children: false,
                    chunks: false,
                    chunkModules: false
                };

                const json = stats.toJson(statsOps);
                const string = stats.toString(statsOps);

                if (stats.hasErrors()) {
                    error(json.errors)
                    error('  Build failed with errors.\n')
                    process.exit(1);
                }
                process.stdout.write(string + '\n\n');
            })
        });
    })
}