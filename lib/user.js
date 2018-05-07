"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUserConfig = getUserConfig;
exports.getProjectType = getProjectType;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _chalk = _interopRequireDefault(require("chalk"));

var _webpack = _interopRequireDefault(require("webpack"));

var _constant = require("./constant");

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function processUserFile(getType, args) {
  const cwd = process.cwd();
  let userConfig = {};

  const configPath = _path.default.join(cwd, _constant.CONFIG_FILE_NAME);

  const configFileExists = _fs.default.existsSync(configPath);

  if (configFileExists) {
    try {
      !getType && (0, _utils.info)(`import config file ${configPath}`);
      userConfig = require(configPath);
      delete require.cache[configPath];
    } catch (e) {
      (0, _utils.error)(`import config file failed: ${e.message}`);
      process.exit(1);
    }
  } else {
    (0, _utils.error)(`can not find the config file '${_constant.CONFIG_FILE_NAME}' in ${cwd}`);
    process.exit(1);
  }

  if ((0, _utils.typeOf)(userConfig) === 'function') {
    userConfig = userConfig({
      webpack: _webpack.default,
      args
    });
  }

  if ((0, _utils.typeOf)(userConfig) !== 'object') {
    (0, _utils.error)('config must be return an object');
    process.exit(1);
  }

  if ('type' in userConfig) {
    if (_constant.PROJECT_TYPES.indexOf(userConfig.type) === -1) {
      (0, _utils.error)(`userConfig.type must be in [${_constant.PROJECT_TYPES.toString()}]`);
      process.exit(1);
    }
  } else {
    (0, _utils.error)('userConfig.type can not be undefined');
    process.exit(1);
  }

  return userConfig;
}

function getUserConfig(args = {}) {
  let userConfig = processUserFile();
  ['babel', 'nodeServer', 'webpack', 'zipGlob'].forEach(item => {
    if (!(item in userConfig)) {
      userConfig[item] = {};
    } else if ((0, _utils.typeOf)(userConfig[item]) !== 'object') {
      userConfig[item] = {};
    }
  });
  return userConfig;
}

function getProjectType(args = {}) {
  let userConfig = processUserFile(true);
  return userConfig.type;
}