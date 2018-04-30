import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import webpack from 'webpack';
import { CONFIG_FILE_NAME, PROJECT_TYPES } from './constant';
import { typeOf, error, info } from './utils';
function processUserFile(getType, args) {
    const cwd = process.cwd();
    let userConfig = {};
    const configPath = path.join(cwd, CONFIG_FILE_NAME);
    const configFileExists = fs.existsSync(configPath);

    if (configFileExists) {
        try {
            !getType && info(`import config file ${configPath}`);
            userConfig = require(configPath);
            delete require.cache[configPath];
        } catch (e) {
            error(`import config file failed: ${e.message}`);
            process.exit(1);
        }
    } else {
        error(`can not find the config file '${CONFIG_FILE_NAME}' in ${cwd}`);
        process.exit(1);
    }

    if (typeOf(userConfig) === 'function') {
        userConfig = userConfig({ webpack, args });
    }

    if (typeOf(userConfig) !== 'object') {
        error('config must be return an object');
        process.exit(1);
    }
    if ('type' in userConfig) {
        if (PROJECT_TYPES.indexOf(userConfig.type) === -1) {
            error(`userConfig.type must be in [${PROJECT_TYPES.toString()}]`);
            process.exit(1);
        }
    } else {
        error('userConfig.type can not be undefined');
        process.exit(1);
    }
    return userConfig;
}
export function getUserConfig(args = {}) {
    let userConfig = processUserFile();

    ['babel', 'nodeServer', 'webpack', 'zipGlob'].forEach(item => {
        if (!(item in userConfig)) {
            userConfig[item] = {};
        } else if (typeOf(userConfig[item]) !== 'object') {
            userConfig[item] = {};
        }
    });
    
    userConfig.args = args;
    
    return userConfig;
}

export function getProjectType(args = {}) {
    let userConfig = processUserFile(true);
    return userConfig.type;
}