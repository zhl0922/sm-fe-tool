export const CONFIG_FILE_NAME = 'sm.config.js';
export const REACT_APP = 'react-app';
export const PROJECT_TYPES = [REACT_APP];
export const COMMANDS = ['dev-server', 'build', 'create', 'node-server', 'build-zip'];
export const DEFAULT_STAGE = 2;
export const DEFAULT_PUBLIC_PATH = '/';
export const DEFAULT_OUTPUT_PATH = 'dist';
export const DEFAULT_DEV_SERVER_PORT = process.env.port || 4000;
export const DEFAULT_NODE_SERVER_DEBUG_PORT = 5858;
export const DEFAULT_DEV_SERVER_HOST = 'localhost';
export const COMMON_CHUNK_NAME = 'common';
export const RUNTIME_CHUNK_NAME = 'runtime';
export const DEFAULT_BROWSERS = [
    "> 1%",
    "last 2 versions",
    "not ie <= 9"
];