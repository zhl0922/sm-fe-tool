import webpack from 'webpack';
import merge from 'webpack-merge';
import CopyPlugin from 'copy-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CompressionWebpackPlugin from 'compression-webpack-plugin';
import autoprefixer from 'autoprefixer';
import HappyPack from 'happypack';
import path from 'path';

import createBabelConfig from './createBabelConfig';
import createResourceMap from './createResourceMap';
import { error, resolve, typeOf, processEntry } from './utils';
import { DEFAULT_BROWSERS, DEFAULT_PUBLIC_PATH, DEFAULT_OUTPUT_PATH } from './constant';

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

function createBaseRules() {
    return [
        {
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            loader: resolve('url-loader'),
            options: {
                limit: 10000,
                name: 'img/[name].[hash:7].[ext]',
                fallback: resolve('file-loader')
            }
        },
        {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: resolve('url-loader'),
            options: {
                limit: 10000,
                name: 'fonts/[name].[hash:7].[ext]',
                fallback: resolve('file-loader')
            }
        }
    ];
}
export default function createWebpackConfig(userConfig, externalConfig = {}) {
    const isProduction = process.env.NODE_ENV === 'production';
    const cwd = process.cwd();
    let {
        browsers = DEFAULT_BROWSERS,
        webpack: {
            entry: userEntry,
            publicPath = DEFAULT_PUBLIC_PATH,
            outputPath = DEFAULT_OUTPUT_PATH,
            resolve: userResolve,
            copy,
            define,
            extractCss = true,
            externals,
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
        output: externalOutput,
        ...otherExternalConfig
    } = externalConfig;

    extractCss = isProduction && extractCss;

    if (!userEntry) {
        error('webpack.entry can not find');
        process.exit(1);
    }
    const entry = processEntry(userEntry, externalEntry);

    outputPath = path.join(cwd, outputPath);

    const output = {
        path: outputPath,
        filename: 'js/[name].js',
        publicPath
    };

    let resolveConfig = {
        modules: ['node_modules'],
        extensions: ['.js', '.jsx', '.less', '.css']
    };
    if (userResolve) {
        resolveConfig = merge(resolveConfig, userResolve)
    }

    let config = {
        mode: isProduction ? 'production' : 'development',
        entry,
        output: {
            ...output,
            ...externalOutput
        },
        resolve: resolveConfig,
        module: {
            rules: [
                createBabelRule(),
                ...createStyleRules({
                    extractCss,
                    browsers
                }),
                ...createBaseRules()
            ]
        },
        plugins: [
            createHappyInstance('css', { minimize: isProduction }),
            createHappyInstance('less'),
            createHappyInstance('babel', {
                cacheDirectory: true,
                ...createBabelConfig(userConfig, babel)
            }),
        ]
    };

    config = merge(config, otherExternalConfig);

    if (noParse) {
        config.module.noParse = noParse;
    }

    if (define) {
        config.plugins.push(new webpack.DefinePlugin(define));
    }

    if (extractCss) {
        config.plugins.push(
            new MiniCssExtractPlugin({
                filename: 'css/[name].[contenthash].css',
                chunkFilename: 'css/[name].[contenthash].css'
            })
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

    if (externals) {
        config.externals = externals;
    }

    config.plugins.push(...userPlugins);
    config.module.rules.push(...userRules);

    config.plugins.push(createResourceMap(outputPath));

    if (typeOf(userConfigFn) === 'function') {
        config = userConfigFn(config);
        if (!config) {
            error('webpack.config() must return the webpack config object');
            process.exit(1);
        }
    }
    
    return config;
}