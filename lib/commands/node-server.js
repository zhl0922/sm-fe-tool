"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = nodeServer;

var _user = require("../user");

var _constant = require("../constant");

var _nodemon = _interopRequireDefault(require("nodemon"));

var _path = require("path");

var _chalk = _interopRequireDefault(require("chalk"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function nodeServer(args) {
  const debugPort = args.debug || _constant.DEFAULT_NODE_SERVER_DEBUG_PORT;
  const {
    nodeServer
  } = (0, _user.getUserConfig)(args);
  const exec = `node --debug=${debugPort}`;
  (0, _nodemon.default)(_objectSpread({
    exec,
    // script: path.join(cwd, 'www'),
    // watch: {},
    restartable: 'rs',
    verbose: false,
    ext: 'js'
  }, nodeServer)).on('start', () => {
    console.log(_chalk.default.yellow(`[node-server] starting '${exec} ${(0, _path.basename)(nodeServer.script)}'`));
  });
}

module.exports = exports["default"];