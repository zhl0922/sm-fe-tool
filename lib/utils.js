'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.typeOf = typeOf;
exports.error = error;
exports.info = info;
exports.success = success;
exports.warning = warning;
exports.resolve = resolve;
exports.processEntry = processEntry;
exports.parseTemplate = parseTemplate;
exports.parseFileNamePrefix = parseFileNamePrefix;

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function typeOf(o) {
    if (Number.isNaN(o)) return 'nan';
    return Object.prototype.toString.call(o).slice(8, -1).toLowerCase();
}

function error(msg) {
    console.log(_chalk2.default.red(msg));
}

function info(msg) {
    console.log(_chalk2.default.cyan(msg));
}

function success(msg) {
    console.log(_chalk2.default.green(msg));
}

function warning(msg) {
    console.log(_chalk2.default.yellow(msg));
}

function resolve(mod) {
    return require.resolve(mod);
}

function processEntry(userEntry, externalEntry) {
    if (typeOf(userEntry) == 'string') {
        userEntry = [...externalEntry, userEntry];
    } else if (typeOf(userEntry) == 'object') {
        Object.keys(userEntry).map(key => {
            let item = userEntry[key];
            userEntry[key] = [...externalEntry, ...(typeOf(item) == 'array' ? item : [item])];
        });
    } else if (typeOf(userEntry) == 'array') {
        userEntry = [...externalEntry, ...userEntry];
    }
    return userEntry;
}

function parseTemplate(str, data) {
    return str.replace(/\{\{(.+?)\}\}/g, (m, key) => data[key.trim()] || '');
}

function parseFileNamePrefix(name) {
    const prefixReg = /^_/;
    return {
        name: name.replace(prefixReg, ''),
        match: prefixReg.test(name)
    };
}