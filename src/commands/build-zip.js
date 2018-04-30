import archiver from 'archiver';
import fs from 'fs';
import { mkdirs } from 'fs-extra';
import { join } from 'path';
import ora from 'ora';
import chalk from 'chalk';
import { error, info } from '../utils';
import { getUserConfig } from '../user';

export default function buildZip(args) {
    
    const { zipGlob } = getUserConfig(args);
    let {
        pattern = [],
        ignore = [],
        ...otherGlobConfig
    } = zipGlob;
    
    const cwd = process.cwd();

    let outputName = 'release';
    let userPkgPath = join(cwd, 'package.json');

    if (fs.existsSync(userPkgPath)) {
        outputName = `${require(userPkgPath).name}.zip`;
    }

    const spinner = ora({
        spinner: 'line',
        text: chalk.cyan(`building ${outputName}...`)
    }).start();

    const outputSubDir = 'release';
    const outputDir = join(cwd, outputSubDir);

    if (!fs.existsSync(outputDir)) {
        mkdirs(outputDir);
    }

    const archive = archiver('zip', {
        zlib: { level: 9 }
    });

    const output = fs.createWriteStream(join(outputDir, outputName));

    archive.on('error', function (err) {
        throw err;
    });
    archive.on('end', function (err) {
        spinner.stop();
        info(`${outputName} build compoletd in ${outputDir}`);
    });
    archive.pipe(output);
    archive.glob(`{client/dist/**,./*,server/**,${pattern.join(',')}}`, {
        dot: true,
        cwd: cwd,
        ignore: ['./sm.config.js', `./${outputSubDir}/**`, ...ignore],
        ...otherGlobConfig
    });
    archive.finalize();
}