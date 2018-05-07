"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = create;

var _inquirer = _interopRequireDefault(require("inquirer"));

var _chalk = _interopRequireDefault(require("chalk"));

var _path = require("path");

var _vinylFs = _interopRequireDefault(require("vinyl-fs"));

var _through = _interopRequireDefault(require("through2"));

var _fs = require("fs");

var _emptyDir = require("empty-dir");

var _leftPad = _interopRequireDefault(require("left-pad"));

var _fsExtra = require("fs-extra");

var _constant = require("../constant");

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

function info(type, message) {
  console.log(`${_chalk.default.green.bold((0, _leftPad.default)(type, 12))}  ${message || ''}`);
}

function create(_x) {
  return _create.apply(this, arguments);
}

function _create() {
  _create = _asyncToGenerator(function* (args) {
    try {
      let [projectType, projectName] = args._.slice(1);

      if (projectType && _constant.PROJECT_TYPES.indexOf(projectType) === -1) {
        (0, _utils.error)(`Project type must be in [${_constant.PROJECT_TYPES.toString()}]`);
        process.exit(1);
      }

      if (!projectType) {
        projectType = yield _inquirer.default.prompt([{
          type: 'list',
          choices: _constant.PROJECT_TYPES,
          message: _chalk.default.italic('Choose the project type'),
          name: 'projectType',
          default: 'react-app'
        }]).then(as => as.projectType);
      }

      const author = yield _inquirer.default.prompt([{
        type: 'input',
        message: _chalk.default.italic('Input project author'),
        name: 'author',
        validate: input => input !== ''
      }]).then(as => as.author);
      const description = yield _inquirer.default.prompt([{
        type: 'input',
        message: _chalk.default.italic('Input project description'),
        name: 'description',
        default: projectType
      }]).then(as => as.description);
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

      _vinylFs.default.src(['**/*', '!node_modules/**/*'], {
        cwd,
        cwdbase: true,
        dot: false
      }).pipe(createTemplate(cwd, {
        projectName,
        projectType,
        author,
        description
      })).pipe(_vinylFs.default.dest(dest)).on('end', function () {// console.log(`${chalk.cyan.bold(leftPad('succeeded', 12))}`);
      }).resume();
    } catch (e) {
      process.exit(1);
    }
  });
  return _create.apply(this, arguments);
}

function createTemplate(cwd, templateData = {}) {
  return _through.default.obj(function (chunk, enc, cb) {
    if (!chunk.stat.isFile()) {
      return cb();
    }

    const parts = chunk.path.split(_path.sep);
    const oldName = parts.pop();
    const newName = (0, _utils.parseFileNamePrefix)(oldName);

    if (newName.match) {
      chunk.path = [...parts, newName.name].join(_path.sep);
      chunk.contents = Buffer((0, _utils.parseTemplate)(chunk.contents.toString(), templateData));
    }

    info('create', chunk.path.replace(cwd + '/', ''));
    this.push(chunk);
    cb();
  });
}

module.exports = exports["default"];