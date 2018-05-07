import webpack from 'webpack';
import merge from 'webpack-merge';
import CopyPlugin from 'copy-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CompressionWebpackPlugin from 'compression-webpack-plugin';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';
import autoprefixer from 'autoprefixer';
import HappyPack from 'happypack';
import path from 'path';
import chalk from 'chalk';

import createBabelConfig from './createBabelConfig';
import createResourceMap from './createResourceMap';
import { error, resolve, typeOf, processEntry } from './utils';
import {
    DEFAULT_BROWSERS,
    DEFAULT_PUBLIC_PATH,
    DEFAULT_OUTPUT_PATH,
    COMMON_CHUNK_NAME,
    RUNTIME_CHUNK_NAME
} from './constant';

import os from 'os';

function createHappyInstance(extension, options) {
    const threadPool = HappyPack.ThreadPool({ size: os.cpus().length - 1 });
    const loader = {
        loader: resolve(`${extension}-loader`),
    };
    if (options) {
        loader.options = options;
    }
    return new HappyPack({
        id: extension,
        loaders: [loader],
        threadPool: threadPool,
        verbose: false
    });
}

function createBabelRule() {
    return {
        test: /\.(js|jsx)$/,
        loader: resolve('happypack/loader'),
        options: {
            id: 'babel'
        },
        exclude: /node_modules/,
        // include: path.join(process.cwd(), 'client/src')
    };
}

function createStyleRules(options) {
    const {
        browsers,
        extractCss
    } = options;
    const cssLoader = {
        loader: resolve('happypack/loader'),
        options: { id: 'css' }
    };
    const postcssLoader = {
        loader: resolve('postcss-loader'),
        options: {
            plugins: function () {
                return [autoprefixer({ browsers })]
            },
        }
    };
    function generateLoaders(loader) {
        let loaders = [cssLoader, postcssLoader];
        if (loader) {
            loaders.push({
                loader: resolve('happypack/loader'),
                options: { id: loader }
            });
        }
        return [
            extractCss ? MiniCssExtractPlugin.loader : resolve('style-loader'),
            ...loaders
        ];
    }
    const loaders = {
        css: generateLoaders(),
        less: generateLoaders('less')
    }
    let output = [];
    for (let extension in loaders) {
        let loader = loaders[extension]
        output.push({
            test: new RegExp('\\.' + extension + '$'),
            use: loader
        })
    }
    return output;
}

function createBaseRules(isModule) {
    return [
        {
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            loader: resolve('url-loader'),
            options: {
                limit: 10000,
                name: isModule ? 'assets/[name].[ext]' : 'img/[name].[hash:7].[ext]',
                fallback: resolve('file-loader')
            }
        },
        {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: resolve('url-loader'),
            options: {
                limit: 10000,
                name: isModule ? 'assets/[name].[ext]' : 'fonts/[name].[hash:7].[ext]',
                fallback: resolve('file-loader')
            }
        }
    ];
}
export default function createWebpackConfig(userConfig, buildConfig = {}) {
    const isProduction = process.env.NODE_ENV === 'production';
    const cwd = process.cwd();
    let {
        browsers = DEFAULT_BROWSERS,
        webpack: {
            entry: userEntry,
            library: userLibrary,
            libraryTarget: userLibraryTarget,
            publicPath = DEFAULT_PUBLIC_PATH,
            outputPath = DEFAULT_OUTPUT_PATH,
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
        resourceMap,
        ...extraConfig
    } = buildConfig;

    if (!userEntry) {
        error('webpack.entry can not find');
        process.exit(1);
    }

    outputPath = path.join(cwd, outputPath);

    let resolveConfig = {
        modules: ['node_modules'],
        extensions: ['.js', '.jsx', '.less', '.css']
    };
    if (userResolve) {
        resolveConfig = merge(resolveConfig, userResolve)
    }

    let config = {
        mode: isProduction ? 'production' : 'development',
        entry: processEntry(userEntry, buildEntry),
        output: {
            path: outputPath,
            filename: 'js/[name].js',
            publicPath
        },
        resolve: resolveConfig,
        module: {
            rules: [
                createBabelRule(),
                ...createStyleRules({
                    extractCss,
                    browsers
                }),
                ...createBaseRules(isModule)
            ]
        },
        plugins: [
            createHappyInstance('css', { minimize: isProduction }),
            createHappyInstance('less'),
            createHappyInstance('babel', {
                cacheDirectory: true,
                babelrc: false,
                ...createBabelConfig(userConfig, buildBabelConfig)
            }),
        ]
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
                        name: COMMON_CHUNK_NAME,
                        test: /[\\/]node_modules[\\/]/,
                        enforce: true
                    }
                }
        };
        config.optimization.runtimeChunk = {
            name: RUNTIME_CHUNK_NAME
        };
    }

    if (progress) {
        config.plugins.push(
            new ProgressBarPlugin({
                format: chalk.cyan('building [:bar]:percent'),
                summary: false
            })
        );
    }

    if (noParse) {
        config.module.noParse = noParse;
    }

    if (define) {
        config.plugins.push(new webpack.DefinePlugin(define));
    }

    if (extractCss) {
        config.plugins.push(
            new MiniCssExtractPlugin(
                isModule ? {
                    filename: 'index.css'
                } : {
                        filename: 'css/[name].[contenthash].css',
                        chunkFilename: 'css/[name].[contenthash].css'
                    }
            )
        );
    }

    if (copy) {
        config.plugins.push(new CopyPlugin(copy));
    }

    if (gzip) {
        let gzipOps = {
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp(
                '\\.(' +
                ['js', 'css'].join('|') +
                ')$'
            ),
            threshold: 10240,
            minRatio: 0.8
        };
        if (typeOf(gzip) === 'object') {
            gzipOps = { ...gzipOps, gzip };
        }
        config.plugins.push(
            new CompressionWebpackPlugin(gzipOps)
        );
    }

    if (userExternals) {
        config.externals = config.externals || {};
        config.externals = {
            ...config.externals,
            ...userExternals
        };
    }

    config.plugins.push(...userPlugins);
    config.module.rules.push(...userRules);

    config = merge(config, extraConfig);

    if (resourceMap) {
        config.plugins.push(createResourceMap(outputPath));
    }
    
    if (typeOf(userConfigFn) === 'function') {
        config = userConfigFn(config);
        if (!config) {
            error('webpack.config() must return the webpack config object');
            process.exit(1);
        }
    }

    return config;
}