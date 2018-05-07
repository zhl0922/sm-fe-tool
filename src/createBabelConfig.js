import merge from 'webpack-merge';
import { DEFAULT_STAGE, DEFAULT_BROWSERS } from './constant';
import { typeOf, error, resolve } from './utils';
import path from 'path';
export default function createBabelConfig(userConfig, externalConfig = {}) {
    const {
        type,
        babel: {
            plugins: userPlugins = [],
            presets: userPresets = [],
            stage: userStage,
            config: userConfigFn,
        },
        browsers = DEFAULT_BROWSERS
    } = userConfig;

    let plugins = [];
    let presets = [];

    const {
        runtime,
        dynamicImport,
        ...otherExternalConfig
    } = externalConfig

    presets.push(
        [
            resolve('@babel/preset-env'),
            {
                modules: false,
                targets: {
                    browsers
                }
            },
        ]
    );
    if (runtime) {
        plugins.push([
            resolve('@babel/plugin-transform-runtime'),
            {
                moduleName: path.dirname(resolve('@babel/runtime/package'))
            }
        ]);
    }

    if (dynamicImport) {
        plugins.push(resolve('@babel/plugin-syntax-dynamic-import'));
    }
    
    let stage = userStage != null ? userStage : DEFAULT_STAGE;
    if (typeOf(stage) === 'number') {
        const stagePlugin = resolve(`@babel/preset-stage-${stage}`);
        if (stage <= 2) {
            presets.push(
                [
                    stagePlugin,
                    { decoratorsLegacy: true }
                ]
            );
            // plugins.push(resolve('babel-plugin-transform-decorators-legacy'));
        } else {
            presets.push(stagePlugin);
        }
    }

    presets = [...presets, ...userPresets];
    plugins = [...plugins, ...userPlugins];

    let config = {
        presets,
        plugins,
        // comments: false,
        babelrc: false
    };

    config = merge(config, otherExternalConfig);

    if (typeOf(userConfigFn) === 'function') {
        config = userConfigFn(config);
        if (!config) {
            error('babel.config() must return the babel config object');
            process.exit(1);
        }
    }

    return config;
}