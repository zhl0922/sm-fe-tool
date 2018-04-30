'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = nodeServer;

var _user = require('../user');

var _constant = require('../constant');

var _nodemon = require('nodemon');

var _nodemon2 = _interopRequireDefault(_nodemon);

var _path = require('path');

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function nodeServer(args) {
    const debugPort = args.debug || _constant.DEFAULT_NODE_SERVER_DEBUG_PORT;
    const {
        nodeServer
    } = (0, _user.getUserConfig)(args);
    const exec = `node --debug=${debugPort}`;

    (0, _nodemon2.default)(_extends({
        exec,
        // script: path.join(cwd, 'www'),
        // watch: {},
        restartable: 'rs',
        verbose: false,
        ext: 'js'
    }, nodeServer)).on('start', () => {
        console.log(_chalk2.default.yellow(`[node-server] starting '${exec} ${(0, _path.basename)(nodeServer.script)}'`));
    });
}
module.exports = exports['default'];