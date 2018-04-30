'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = buildZip;

var _archiver = require('archiver');

var _archiver2 = _interopRequireDefault(_archiver);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _fsExtra = require('fs-extra');

var _path = require('path');

var _ora = require('ora');

var _ora2 = _interopRequireDefault(_ora);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _utils = require('../utils');

var _user = require('../user');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function buildZip(args) {

    const { zipGlob } = (0, _user.getUserConfig)(args);
    let {
        pattern = [],
        ignore = []
    } = zipGlob,
        otherGlobConfig = _objectWithoutProperties(zipGlob, ['pattern', 'ignore']);

    const cwd = process.cwd();

    let outputName = 'release';
    let userPkgPath = (0, _path.join)(cwd, 'package.json');

    if (_fs2.default.existsSync(userPkgPath)) {
        outputName = `${require(userPkgPath).name}.zip`;
    }

    const spinner = (0, _ora2.default)({
        spinner: 'line',
        text: _chalk2.default.cyan(`building ${outputName}...`)
    }).start();

    const outputSubDir = 'release';
    const outputDir = (0, _path.join)(cwd, outputSubDir);

    if (!_fs2.default.existsSync(outputDir)) {
        (0, _fsExtra.mkdirs)(outputDir);
    }

    const archive = (0, _archiver2.default)('zip', {
        zlib: { level: 9 }
    });

    const output = _fs2.default.createWriteStream((0, _path.join)(outputDir, outputName));

    archive.on('error', function (err) {
        throw err;
    });
    archive.on('end', function (err) {
        spinner.stop();
        (0, _utils.info)(`${outputName} build compoletd in ${outputDir}`);
    });
    archive.pipe(output);
    archive.glob(`{client/dist/**,./*,server/**,${pattern.join(',')}}`, _extends({
        dot: true,
        cwd: cwd,
        ignore: ['./sm.config.js', `./${outputSubDir}/**`, ...ignore]
    }, otherGlobConfig));
    archive.finalize();
}
module.exports = exports['default'];