'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _path = require('path');

var _vinylFs = require('vinyl-fs');

var _vinylFs2 = _interopRequireDefault(_vinylFs);

var _through = require('through2');

var _through2 = _interopRequireDefault(_through);

var _fs = require('fs');

var _emptyDir = require('empty-dir');

var _leftPad = require('left-pad');

var _leftPad2 = _interopRequireDefault(_leftPad);

var _fsExtra = require('fs-extra');

var _constant = require('../constant');

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function info(type, message) {
    console.log(`${_chalk2.default.green.bold((0, _leftPad2.default)(type, 12))}  ${message || ''}`);
}

exports.default = (() => {
    var _ref = _asyncToGenerator(function* (args) {
        try {
            let [projectType, projectName] = args._.slice(1);

            if (projectType && _constant.PROJECT_TYPES.indexOf(projectType) === -1) {
                (0, _utils.error)(`Project type must be in [${_constant.PROJECT_TYPES.toString()}]`);
                process.exit(1);
            }

            if (!projectType) {
                projectType = yield _inquirer2.default.prompt([{
                    type: 'list',
                    choices: _constant.PROJECT_TYPES,
                    message: _chalk2.default.italic('Choose the project type'),
                    name: 'projectType',
                    default: 'react-app'
                }]).then(function (as) {
                    return as.projectType;
                });
            }

            const author = yield _inquirer2.default.prompt([{
                type: 'input',
                message: _chalk2.default.italic('Input project author'),
                name: 'author',
                validate: function (input) {
                    return input !== '';
                }
            }]).then(function (as) {
                return as.author;
            });

            const description = yield _inquirer2.default.prompt([{
                type: 'input',
                message: _chalk2.default.italic('Input project description'),
                name: 'description',
                default: projectType
            }]).then(function (as) {
                return as.description;
            });

            let dest;
            if (projectName) {
                dest = (0, _path.join)(process.cwd(), projectName);
                if ((0, _fs.existsSync)(dest)) {
                    (0, _utils.error)('Directory already exists!');
                    process.exit(1);
                }
                (0, _fsExtra.mkdirpSync)(dest);
                process.chdir(dest);
            }
            const cwd = (0, _path.join)(__dirname, '../../templates', projectType);
            dest = process.cwd();
            projectName = (0, _path.basename)(dest);
            if (!(0, _emptyDir.sync)(dest)) {
                (0, _utils.error)('Existing files here, please run the command in an empty folder!');
                process.exit(1);
            }
            console.log(`Creating new project in ${dest}.`);

            _vinylFs2.default.src(['**/*', '!node_modules/**/*'], { cwd, cwdbase: true, dot: true }).pipe(createTemplate(cwd, {
                projectName,
                projectType,
                author,
                description
            })).pipe(_vinylFs2.default.dest(dest)).on('end', function () {
                console.log(`${_chalk2.default.cyan.bold((0, _leftPad2.default)('succeeded', 12))}`);
            }).resume();
        } catch (e) {
            process.exit(1);
        }
    });

    function create(_x) {
        return _ref.apply(this, arguments);
    }

    return create;
})();

function createTemplate(cwd, templateData = {}) {
    return _through2.default.obj(function (chunk, enc, cb) {
        if (!chunk.stat.isFile()) {
            return cb();
        }
        info('create', chunk.path.replace(cwd + '/', ''));

        const parts = chunk.path.split(_path.sep);
        const oldName = parts.pop();
        const newName = (0, _utils.parseFileNamePrefix)(oldName);

        if (newName.match) {
            chunk.path = [...parts, newName.name].join(_path.sep);
            chunk.contents = Buffer((0, _utils.parseTemplate)(chunk.contents.toString(), templateData));
        }

        this.push(chunk);
        cb();
    });
}
module.exports = exports['default'];