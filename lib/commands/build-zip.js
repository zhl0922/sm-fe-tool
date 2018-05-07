"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = buildZip;

var _archiver = _interopRequireDefault(require("archiver"));

var _fs = _interopRequireDefault(require("fs"));

var _fsExtra = require("fs-extra");

var _path = require("path");

var _ora = _interopRequireDefault(require("ora"));

var _chalk = _interopRequireDefault(require("chalk"));

var _utils = require("../utils");

var _user = require("../user");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function buildZip(args) {
  const {
    zipGlob
  } = (0, _user.getUserConfig)(args);

  let {
    pattern = [],
    ignore = []
  } = zipGlob,
      otherGlobConfig = _objectWithoutProperties(zipGlob, ["pattern", "ignore"]);

  const cwd = process.cwd();
  let outputName = 'release';
  let userPkgPath = (0, _path.join)(cwd, 'package.json');

  if (_fs.default.existsSync(userPkgPath)) {
    outputName = `${require(userPkgPath).name}.zip`;
  }

  const spinner = (0, _ora.default)({
    spinner: 'line',
    text: _chalk.default.cyan(`building ${outputName}...`)
  }).start();
  const outputSubDir = 'release';
  const outputDir = (0, _path.join)(cwd, outputSubDir);

  if (!_fs.default.existsSync(outputDir)) {
    (0, _fsExtra.mkdirs)(outputDir);
  }

  const archive = (0, _archiver.default)('zip', {
    zlib: {
      level: 9
    }
  });

  const output = _fs.default.createWriteStream((0, _path.join)(outputDir, outputName));

  archive.on('error', function (err) {
    throw err;
  });
  archive.on('end', function (err) {
    spinner.stop();
    (0, _utils.info)(`${outputName} build compoletd in ${outputDir}`);
  });
  archive.pipe(output);
  archive.glob(`{client/dist/**,./*,server/**,${pattern.join(',')}}`, _objectSpread({
    dot: true,
    cwd: cwd,
    ignore: ['./sm.config.js', `./${outputSubDir}/**`, ...ignore]
  }, otherGlobConfig));
  archive.finalize();
}

module.exports = exports["default"];