import parseArgs from 'minimist';
import { resolve } from './utils';
import { cyan, green, red, yellow } from 'chalk';
import { COMMANDS } from './constant';

const args = parseArgs(process.argv.slice(2));
const command = args._[0];

process.on('SIGINT', () => {
    process.exit(0);
});

function isValidCommand(cmd) {
    return COMMANDS.indexOf(cmd) > -1;
}
function outputVersion() {
    const pkg = require('../package.json')
    console.log(`v${pkg.version}`);
    process.exit(0);
}
function outputHelp() {
    console.log(`Usage: ${green('sm')} ${yellow('<command>')} ${cyan('[options]')}

Options:
${cyan('-h, --help')}     output usage information
${cyan('-v, --version')}  output the version number  

commands:
  ${green('sm create')} ${yellow('<project_type> <project_name>')}
    Create a project in a new directory
    
    Project types:
      ${yellow('react-app')}        a react app
      ${yellow('react-component')}  a react component
      ${yellow('node-module')}      a node library npm module

  ${green('sm dev-server')} ${yellow('[options]')}
    Start dev static dev server
    
    Options:
      ${yellow('--port')}  static dev server port and the default port is 4000

  ${green('sm node-server')} ${yellow('[options]')}
    Start node server use nodemon, see nodemon documention
    
    Options:
      ${yellow('--debug')}  debug port and the default port is 5858

  ${green('sm build')}
    Build project

  ${green('sm build-zip')}
    Build zip for project
`)
    process.exit(args.help || command ? 0 : 1);
}

if (args.version || args.v) {
    outputVersion();
}
if (args.help || args.h || !command || !isValidCommand(command)) {
    outputHelp();
}

const commandModulePath = resolve(`./commands/${command}`);
const commandModule = require(commandModulePath);
if (typeof commandModule === 'function') {
    commandModule(args);
}