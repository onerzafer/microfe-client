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
                .map(path =>
                    new Promise((resolve, reject) => this.readFile(path, resolve, reject))
                        .then(file => MicroAppWrapper.sanitizeCss(containerId, file))
                        .then(file => MicroAppWrapper.fixRelativePathsInCss(manifest.name, containerId, file))
                );
            const jsFilePromises = bundle
                .filter(({ type }) => type === 'js')
                .map(({ path }) => `${appRootPath}/${path}`)
                .map(path => new Promise((resolve, reject) => this.readFile(path, resolve, reject)));

            // get template and be sure there is only one template
            // extract inline css and inject them on top of cssFilesPromises
            // extract inline js and inject them on top of jsFilesPromises
            // fetch 3rdy party css files and inject them on top of cssFilesPromises
            // fetch 3rdy party js files and inject them on top of jsFilesPromises
            // get only the content inside body area
            // clean inline css, js
            const templatePromise = Promise.all(bundle
                .filter(({ type }) => type === 'html' || type === 'template')
                .map(({ path }) => `${appRootPath}/${path}`)
                .map(path =>
                    new Promise((resolve, reject) => this.readFile(path, resolve, reject))
                        .then(file => MicroAppWrapper.fixRelativePathsInTemplates(manifest.name, file))
                        .then(file => MicroAppWrapper.cleanTemplates(file))
                ));

            return Promise.all(cssFilesPromises)
                .then(files => files.join(' '))
                .then(stylesAsText =>
                    templatePromise.then(htmlTemplate =>
                        Promise.all(jsFilePromises)
                            .then(files =>
                                files
                                    .map(file => MicroAppWrapper.fixRelativePathsInJs(manifest.name, strip(file, {})))
                                    .map(file => MicroAppWrapper.fixDocumentAccessJs(file))
                            )
                            .then(files => files.join(' ')) // concat js files
                            .then(appContentAsText =>
                                this.wrapTheApp({
                                    appContentAsText,
                                    ...manifest,
                                    stylesAsText,
                                    containerId,
                                    htmlTemplate,
                                })
                            )
                            .then(appWrappedContentAsText => ({
                                name: manifest.name,
                                file: appWrappedContentAsText,
                            }))
                    )
                );
        });
    }

    async getManifest(path) {
        return await new Promise((resolve, reject) => this.readFile(path, resolve, reject)).then(file =>
            JSON.parse(file)
        );
    }

    readFile(path, resolve, reject) {
        fs.readFile(path, { encoding: 'UTF8' }, (err, file) => (err ? reject(err) : resolve(file)));
    }

    async wrapTheApp({
        appContentAsText,
        name,
        dependencies,
        nonBlockingDependencies,
        stylesAsText = '',
        containerId,
        htmlTemplate,
        type = 'default',
    }) {
        dependencies = dependencies || {};
        nonBlockingDependencies = nonBlockingDependencies || {};
        const parsedDep = Object.keys(dependencies)
            .map(dep => "'" + dep + "'")
            .join(', ');
        const parsedNonBlockingDeps = Object.keys(nonBlockingDependencies)
            .map(dep => "'" + dep + "'")
            .join(', ');
        return await new Promise((resolve, reject) =>
            this.readFile(`${__dirname}/templates/${MicroAppWrapper.templatePath(type)}`, resolve, reject)
        )
            .then(template =>
                template
                    .replace(/__kebab-name__/g, dashify(name))
                    .replace(/__container_id__/g, containerId)
                    .replace(/__name__/g, name)
                    .replace(/__stylesAsText__/g, stylesAsText)
                    .replace(/__template__/g, htmlTemplate)
                    .replace(/__dependencies__/g, parsedDep)
                    .replace(/__nonBlockingDependencies__/g, parsedNonBlockingDeps)
            )
            .then(temp => {
                const tempParts = temp.split('__appContentAsText__');
                return [
                    tempParts[0],
                    appContentAsText.replace(/webpackJsonp/g, `webpackJsonp__${name}`),
                    tempParts[1],
                ].join('');
            });
    }

    static templatePath(type) {
        switch (type) {
            case 'web component':
                return 'web-component.wrapper.template.js';
            case 'service':
                return 'service.wrapper.template.js';
            default:
                return 'app.wrapper.template.js';
        }
    }

    static fixRelativePathsInCss(name, containerId, file) {
        const path = `/micro-apps/${name}/`;
        const relativePathPatternInQuoute = /(?<=\(")((?!data:image)(?!http)(?!micro-apps).)*?(?="\))/g;
        const relativePathPatternNoQuoute = /(?<=url\()((?!data:image)(?!http)(?!micro-apps).)*?(?=\))/g;
        return file
            .replace(/\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/\.\.\//g, path)
            .replace(/\.\.\/\.\.\/\.\.\/\.\.\/\.\.\//g, path)
            .replace(/\.\.\/\.\.\/\.\.\/\.\.\//g, path)
            .replace(/\.\.\/\.\.\/\.\.\//g, path)
            .replace(/\.\.\/\.\.\//g, path)
            .replace(/\.\.\//g, path)
            .replace(/\.\//g, path)
            .replace(relativePathPatternInQuoute, `${path}$&`)
            .replace(relativePathPatternNoQuoute, `${path}$&`)
    }

    static sanitizeCss(containerId, file) {
        return file
            .replace(/html|body/g, `#${containerId}`)
            .replace(/\\/g, '\\\\')
    }

    static fixRelativePathsInJs(name, file) {
        const path = `micro-apps/${name}/`;
        return file.replace(/((?<=(["']))[.\/a-zA-Z0-9\-_]*?)(\.((sv|pn)g)|(jpe?g)|(gif))(?=\2)/g, `${path}$&`);
    }

    static fixDocumentAccessJs(file) {
        return file.replace(/document.get/g, 'SHADOWROOT.get');
    }

    static fixRelativePathsInTemplates(name, file) {
        const path = `micro-apps/${name}/`;
        return file
            .replace(/(?<=src=")[.\/a-zA-Z0-9\-_]*?(?=")/gi, `${path}$&`)
            .replace(/(?<=href=")[.\/a-zA-Z0-9\-_]*?(?=")"/gi, `${path}$&`);
    }

    static cleanTemplates(file) {
        return file
            .replace(/<!--.*-->/gi, '')
            .replace(/<script.*src="(?!http).*\/script>/gi, '')
            .replace(/<script.*src="(?!http).*\/>/gi, '')
            .replace(/<link.*href="(?!http).*\/link>/gi, '')
            .replace(/<link.*href="(?!http).*\/>/gi, '')
            .replace(/<link.*href="(?!http).*>/gi, '');
    }
}

module.exports = MicroAppWrapper;
