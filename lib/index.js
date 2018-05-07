"use strict";

var _minimist = _interopRequireDefault(require("minimist"));

var _utils = require("./utils");

var _chalk = require("chalk");

var _constant = require("./constant");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const args = (0, _minimist.default)(process.argv.slice(2));
const command = args._[0];
process.on('SIGINT', () => {
  process.exit(0);
});

function isValidCommand(cmd) {
  return _constant.COMMANDS.indexOf(cmd) > -1;
}

function outputVersion() {
  const pkg = require('../package.json');

  console.log(`v${pkg.version}`);
  process.exit(0);
}

function outputHelp() {
  console.log(`Usage: ${(0, _chalk.green)('sm')} ${(0, _chalk.yellow)('<command>')} ${(0, _chalk.cyan)('[options]')}

Options:
${(0, _chalk.cyan)('-h, --help')}     output usage information
${(0, _chalk.cyan)('-v, --version')}  output the version number  

commands:
  ${(0, _chalk.green)('sm create')} ${(0, _chalk.yellow)('<project_type> <project_name>')}
    Create a project in a new directory
    
    Project types:
      ${(0, _chalk.yellow)('react-app')}        a react app
      ${(0, _chalk.yellow)('react-component')}  a react component
      ${(0, _chalk.yellow)('node-module')}      a node library npm module

  ${(0, _chalk.green)('sm dev-server')} ${(0, _chalk.yellow)('[options]')}
    Start dev static dev server
    
    Options:
      ${(0, _chalk.yellow)('--port')}  static dev server port and the default port is 4000

  ${(0, _chalk.green)('sm node-server')} ${(0, _chalk.yellow)('[options]')}
    Start node server use nodemon, see nodemon documention
    
    Options:
      ${(0, _chalk.yellow)('--debug')}  debug port and the default port is 5858

  ${(0, _chalk.green)('sm build')}
    Build project

  ${(0, _chalk.green)('sm build-zip')}
    Build zip for project in 'project/release/xxx.zip'
`);
  process.exit(args.help || command ? 0 : 1);
}

if (args.version || args.v) {
  outputVersion();
}

if (args.help || args.h || !command || !isValidCommand(command)) {
  outputHelp();
}

const commandModulePath = (0, _utils.resolve)(`./commands/${command}`);

const commandModule = require(commandModulePath);

if (typeof commandModule === 'function') {
  commandModule(args);
}