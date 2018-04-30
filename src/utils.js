import chalk from 'chalk';
export function typeOf(o) {
    if (Number.isNaN(o)) return 'nan';
    return Object.prototype.toString.call(o).slice(8, -1).toLowerCase();
}

export function error(msg) {
    console.log(chalk.red(msg));
}

export function info(msg) {
    console.log(chalk.cyan(msg));
}

export function success(msg) {
    console.log(chalk.green(msg));
}

export function warning(msg) {
    console.log(chalk.yellow(msg));
}

export function resolve(mod) {
    return require.resolve(mod);
}

export function processEntry(userEntry, externalEntry) {
    if (typeOf(userEntry) == 'string') {
        userEntry = [...externalEntry, userEntry];
    } else if (typeOf(userEntry) == 'object') {
        Object.keys(userEntry).map(key => {
            let item = userEntry[key];
            userEntry[key] = [...externalEntry, ...(typeOf(item) == 'array' ? item : [item])];
        });
    } else if (typeOf(userEntry) == 'array') {
        userEntry = [...externalEntry, ...userEntry];
    }
    return userEntry;
}

export function parseTemplate(str, data) {
    return str.replace(/\{\{(.+?)\}\}/g, (m, key) => data[key.trim()] || '');
}

export function parseFileNamePrefix(name) {
    const prefixReg = /^_/;
    return {
        name: name.replace(prefixReg, ''),
        match: prefixReg.test(name)
    };
}