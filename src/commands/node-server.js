import { getUserConfig } from '../user';
import { DEFAULT_NODE_SERVER_DEBUG_PORT } from '../constant';
import nodemon from 'nodemon';
import { basename } from 'path';
import chalk from 'chalk';


export default function nodeServer(args) {
    const debugPort = args.debug || DEFAULT_NODE_SERVER_DEBUG_PORT;
    const {
        nodeServer
    } = getUserConfig(args);
    const exec = `node --debug=${debugPort}`;
    
    nodemon({
        exec,
        // script: path.join(cwd, 'www'),
        // watch: {},
        restartable: 'rs',
        verbose: false,
        ext: 'js',
        ...nodeServer
    }).on('start', () => {
        console.log(chalk.yellow(`[node-server] starting '${exec} ${basename(nodeServer.script)}'`));
    });
}