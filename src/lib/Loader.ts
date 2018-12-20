import { AppsManager, MicroApp, MicroAppDef } from './AppsManager';

enum TAG {
    script = 'script',
    style = 'style',
}

enum TAG_TYPE {
    script = 'text/javascript',
    style = 'text/stylesheet',
}

class Loader {
    private loadingList: string[] = [];
    private apiUrl: string;

    constructor(private appsManager: AppsManager, private config: { [key: string]: any }) {
        this.apiUrl = config.registryApi;
        appsManager.subscribe(this.onNotFoundApp.bind(this));
    }

    onNotFoundApp(appList: MicroAppDef[]) {
        appList.forEach(({ name }) => {
            if (this.loadingList.indexOf(name) === -1) {
                this.loadingList.push(name);
                this.fetchMicroApp(name);
            }
        });
    }

    static injectToHead(microAppName: string, appContent: string, tag: 'script' | 'style', type: string) {
        const script = document.createElement(tag);
        const inlineScript = document.createTextNode(appContent);
        script.type = type;
        script.id = microAppName;
        script.appendChild(inlineScript);
        document.getElementsByTagName('head')[0].appendChild(script);
    }

    fetchMicroApp(microAppName: string) {
        if (!window || !window['fetch']) {
            return;
        }
        fetch(`${this.apiUrl}/registry/${microAppName}`)
            .then(result => Promise.all([result.clone().text(), result.blob().then(blob => blob.type)]))
            .then(([fileContent, type]) => {
                switch (type) {
                    case 'text/css':
                        Loader.injectToHead(microAppName, fileContent, TAG.style, TAG_TYPE.style);
                        break;
                    case 'application/javascript':
                        Loader.injectToHead(microAppName, fileContent, TAG.script, TAG_TYPE.script);
                        break;
                }
            });
    }
}

export const ResourceLoader: MicroApp = {
    deps: ['Config'],
    name: 'Loader',
    initialize: function(Config, AppsManager) {
        return new Loader(AppsManager, Config);
    },
};
