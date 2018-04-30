'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
const CONFIG_FILE_NAME = exports.CONFIG_FILE_NAME = 'sm.config.js';
const REACT_APP = exports.REACT_APP = 'react-app';
const PROJECT_TYPES = exports.PROJECT_TYPES = [REACT_APP];
const COMMANDS = exports.COMMANDS = ['dev-server', 'build', 'create', 'node-server', 'build-zip'];
const DEFAULT_STAGE = exports.DEFAULT_STAGE = 2;
const DEFAULT_PUBLIC_PATH = exports.DEFAULT_PUBLIC_PATH = '/';
const DEFAULT_OUTPUT_PATH = exports.DEFAULT_OUTPUT_PATH = 'dist';
const DEFAULT_DEV_SERVER_PORT = exports.DEFAULT_DEV_SERVER_PORT = process.env.port || 4000;
const DEFAULT_NODE_SERVER_DEBUG_PORT = exports.DEFAULT_NODE_SERVER_DEBUG_PORT = 5858;
const DEFAULT_DEV_SERVER_HOST = exports.DEFAULT_DEV_SERVER_HOST = 'localhost';
const COMMON_CHUNK_NAME = exports.COMMON_CHUNK_NAME = 'common';
const RUNTIME_CHUNK_NAME = exports.RUNTIME_CHUNK_NAME = 'runtime';
const DEFAULT_BROWSERS = exports.DEFAULT_BROWSERS = ["> 1%", "last 2 versions", "not ie <= 9"];