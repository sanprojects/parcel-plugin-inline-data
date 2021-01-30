const fs = require('fs')
const mime = require('mime-types')
const fetch = require('node-fetch');

module.exports = {
    replaceData,
    replace,
    normalizePath,
};

function normalizePath(path, rootpath) {
    if (path[0] === '/') {
        //path = rootpath[0] + path;
        path = path.substring(1);
    }

    if (fs.existsSync(path)) {
        return path;
    }

    for (let i=0; i < rootpath.length; i++) {
        const newPath = rootpath[i] + '/' + path;
        if (fs.existsSync(newPath)) {
            return newPath;
        }
    }

    return path;
}

async function request(url, opts = {method: 'GET'}) {
    const response = await fetch(url);
    return await response.buffer();
}

async function getContent(url, options) {
    // load url
    if (url.match(/(:\/\/)/)) {
        return await request(url);
    }

    url = normalizePath(url, options.rootpath || []);
    return fs.readFileSync(url);
}

async function replaceAsync(str, regex, asyncFn) {
    const promises = [];
    str.replace(regex, (match, ...args) => {
        const promise = asyncFn(match, ...args);
        promises.push(promise);
    });
    const data = await Promise.all(promises);
    return str.replace(regex, () => data.shift());
}

async function replaceData(data, options = {}) {
    return await replaceAsync(data, /(['"`(])([^'()"]+?)#inline/g, async function (match, p1, url) {
        try {
            const content = await getContent(url, options);
            const type = mime.lookup(url);
            return p1 + 'data:' + type + ';base64,' + content.toString('base64');
        } catch (e) {
            console.error(e, options);
            return match;
        }
    });
}

async function replace(fileName, options = {outputFile: ''}) {
    try {
        options.fileName = fileName;
        let data = fs.readFileSync(fileName).toString();
        let cwd = process.cwd();
        process.chdir(require('path').dirname(fileName));
        data = await replaceData(data, options);
        process.chdir(cwd);
        fs.writeFileSync(options.outputFile || fileName, data);
    } catch (e) {
        console.log(e);
    }
}