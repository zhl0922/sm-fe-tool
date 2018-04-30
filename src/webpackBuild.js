// import ora from 'ora';
import webpack from 'webpack';
import rm from 'rimraf';
import path from 'path';
import chalk from 'chalk';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';
import createBuildWebpackConfig from './createBuildWebpackConfig';
import { getUserConfig } from './user';
import { error, info } from './utils';
import { DEFAULT_OUTPUT_PATH } from './constant';
export default function webpackBuild(args, externalConfig) {
    process.env.NODE_ENV = 'production';
    const cwd = process.cwd();

    const userConfig = getUserConfig(args);
    /* const spinner = ora({
        spinner: 'line',
        text: chalk.cyan('building...')
    }).start(); */

    const webpackConfig = createBuildWebpackConfig(userConfig, {
        plugins: [
            new ProgressBarPlugin({
                format: chalk.cyan('building [:bar]:percent'),
                summary: false
            })
        ],
        ...externalConfig,
    });
    // console.log(JSON.stringify(webpackConfig, null, 4))

    const {
        webpack: {
            outputPath = DEFAULT_OUTPUT_PATH
        }
    } = userConfig;
    let compiler = webpack(webpackConfig);
    return new Promise((resolve, reject) => {
        rm(path.join(cwd, outputPath), err => {
            if (err) throw err;
            compiler.run((err, stats) => {
                // spinner.stop();
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