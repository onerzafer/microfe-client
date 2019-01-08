const fs = require('fs');
const dashify = require('dashify');
const walk = require('walk');
const strip = require('strip-comments');
const uniqid = require('uniqid');

class MicroAppWrapper {
    constructor(config) {
        this.config = config;
    }

    apply(compiler) {
        compiler.hooks.emit.tapAsync('MicroAppWrapper', (compilation, callback) => {
            this.getAppRotPathsList(`${__dirname}/${this.config.microApps}`)
                .then(appRootPaths => {
                    return Promise.all(
                        appRootPaths.map(appRootPath =>
                            this.getMicroApp(appRootPath, uniqid('app-root-')).then(wrappedAppDef => {
                                compilation.assets[`${wrappedAppDef.name}.js`] = {
                                    source: function() {
                                        return wrappedAppDef.file;
                                    },
                                    size: function() {
                                        return wrappedAppDef.file.length;
                                    },
                                };
                            })
                        )
                    );
                })
                .then(() => {
                    callback();
                });
        });
    }

    async getAppRotPathsList(path) {
        return await new Promise(resolve => {
            const files = [];
            const walker = walk.walk(path, { followLinks: false });
            walker.on('file', function(root, stat, next) {
                if (stat.name === 'micro-fe-manifest.json') {
                    files.push(root);
                }
                next();
            });

            walker.on('end', function() {
                resolve(files);
            });
        });
    }

    async getMicroApp(appRootPath, containerId) {
        return await this.getManifest(`${appRootPath}/micro-fe-manifest.json`).then(manifest => {
            const bundle = manifest.bundle || [];
            const cssFilesPromises = bundle
                .filter(({ type }) => type === 'css')
                .map(({ path }) => `${appRootPath}/${path}`)
                .map(path => this.getCssFile(path).then(file => this.fixRelativePathsInCss(manifest.name, containerId, file)));
            const cssPromise = Promise.all(cssFilesPromises)
                //.then(files => files.map(file => strip(file)))
                .then(files => files.join(' ')); // concat css files
            const jsFilePromises = bundle
                .filter(({ type }) => type === 'js')
                .map(({ path }) => `${appRootPath}/${path}`)
                .map(path => this.getJsFile(path));
            const jsPromise = cssPromise.then(stylesAsText =>
                Promise.all(jsFilePromises)
                    .then(files => files.map(file => this.fixRelativePathsInJs(manifest.name,strip(file))))
                    .then(files => files.join(' ')) // concat js files
                    .then(appContentAsText => this.wrapTheApp({ appContentAsText, ...manifest, stylesAsText, containerId }))
                    .then(appWrappedContentAsText => ({
                        name: manifest.name,
                        file: appWrappedContentAsText,
                    }))
            );
            return jsPromise;
        });
    }

    async getManifest(path) {
        return await new Promise((resolve, reject) => this.readFile(path, resolve, reject)).then(file =>
            JSON.parse(file)
        );
    }

    async getJsFile(path) {
        return await new Promise((resolve, reject) => this.readFile(path, resolve, reject));
    }

    async getCssFile(path) {
        return await new Promise((resolve, reject) => this.readFile(path, resolve, reject));
    }

    readFile(path, resolve, reject) {
        fs.readFile(path, { encoding: 'UTF8' }, (err, file) => (err ? reject(err) : resolve(file)));
    }

    async wrapTheApp({ appContentAsText, name, dependencies, nonBlockingDependencies, stylesAsText = '', containerId }) {
        dependencies = dependencies || {};
        nonBlockingDependencies = nonBlockingDependencies || {}
        const parsedDep = Object.keys(dependencies)
            .map(dep => "'" + dep + "'")
            .join(', ');
        const parsedNonBlockingDeps = Object.keys(nonBlockingDependencies)
            .map(dep => "'" + dep + "'")
            .join(', ');
        return await new Promise((resolve, reject) =>
            this.readFile(`${__dirname}/templates/app.wrapper.template.js`, resolve, reject)
        ).then(template =>
            template
                .replace(/__kebab-name__/g, dashify(name))
                .replace(/__container_id__/g, containerId)
                .replace(/__name__/g, name)
                .replace(/__stylesAsText__/g, stylesAsText)
                .replace(/__dependencies__/g, parsedDep)
                .replace(/__nonBlockingDependencies__/g, parsedNonBlockingDeps)
                .replace(/__appContentAsText__/g, appContentAsText)
        );
    }

    fixRelativePathsInCss(name, containerId, file) {
        const path = `micro-apps/${name}/`;
        const relativePathPatternInQuoute = /(?<=\(")((?!data:image)(?!http).)*?(?="\))/g;
        const relativePathPatternNoQuoute = /(?<=url\()((?!data:image)(?!http)(?!micro-apps).)*?(?=\))/g;
        return file
            .replace(relativePathPatternInQuoute, `${path}$&`)
            .replace(relativePathPatternNoQuoute, `${path}$&`)
            .replace(/html|body/g, `#${containerId}`);
    }

    fixRelativePathsInJs(name, file) {
        const path = `micro-apps/${name}/`;
        return file
            .replace(/((?<=(["']))[\.\/a-zA-Z1-9]*?)(\.((sv|pn)g)|(jpe?g)|(gif))(?=\2)/g, `${path}$&`);
    }
}

module.exports = MicroAppWrapper;
