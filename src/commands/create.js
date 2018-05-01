import inquirer from 'inquirer'
import chalk from 'chalk';
import { sep, join, basename } from 'path';
import vfs from 'vinyl-fs';
import through from 'through2';
import { renameSync, existsSync } from 'fs';
import { sync as emptyDir } from 'empty-dir';
import leftPad from 'left-pad';
import { mkdirpSync } from 'fs-extra';

import { PROJECT_TYPES } from '../constant';
import { error, parseTemplate, parseFileNamePrefix } from '../utils';

function info(type, message) {
    console.log(`${chalk.green.bold(leftPad(type, 12))}  ${message || ''}`);
}

export default async function create(args) {
    try {
        let [projectType, projectName] = args._.slice(1);

        if (projectType && PROJECT_TYPES.indexOf(projectType) === -1) {
            error(`Project type must be in [${PROJECT_TYPES.toString()}]`);
            process.exit(1);
        }

        if (!projectType) {
            projectType = await inquirer.prompt([{
                type: 'list',
                choices: PROJECT_TYPES,
                message: chalk.italic('Choose the project type'),
                name: 'projectType',
                default: 'react-app'
            }]).then(as => as.projectType);
        }

        const author = await inquirer.prompt([{
            type: 'input',
            message: chalk.italic('Input project author'),
            name: 'author',
            validate: input => input !== ''
        }]).then(as => as.author);

        const description = await inquirer.prompt([{
            type: 'input',
            message: chalk.italic('Input project description'),
            name: 'description',
            default: projectType
        }]).then(as => as.description);

        let dest;
        if (projectName) {
            dest = join(process.cwd(), projectName);
            if (existsSync(dest)) {
                error(('Directory already exists!'));
                process.exit(1);
            }
            mkdirpSync(dest);
            process.chdir(dest);
        }
        const cwd = join(__dirname, '../../templates', projectType);
        dest = process.cwd();
        projectName = basename(dest);
        if (!emptyDir(dest)) {
            error('Existing files here, please run the command in an empty folder!');
            process.exit(1);
        }
        console.log(`Creating new project in ${dest}.`);

        vfs.src(['**/*', '!node_modules/**/*'], { cwd, cwdbase: true, dot: false })
            .pipe(createTemplate(cwd, {
                projectName,
                projectType,
                author,
                description
            }))
            .pipe(vfs.dest(dest))
            .on('end', function () {
                // console.log(`${chalk.cyan.bold(leftPad('succeeded', 12))}`);
            })
            .resume();
    } catch (e) {
        process.exit(1);
    }
}
function createTemplate(cwd, templateData = {}) {
    return through.obj(function (chunk, enc, cb) {
        if (!chunk.stat.isFile()) {
            return cb();
        }

        const parts = chunk.path.split(sep);
        const oldName = parts.pop();
        const newName = parseFileNamePrefix(oldName);

        if (newName.match) {
            chunk.path = [...parts, newName.name].join(sep);
            chunk.contents = Buffer(
                parseTemplate(chunk.contents.toString(), templateData)
            );
        }
        info('create', chunk.path.replace(cwd + '/', ''));

        this.push(chunk);
        cb();
    });
}


