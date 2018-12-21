import { AppsManager } from './AppsManager'
import { MicroAppDef } from './AppsManager.interface'
import { TAG, TAG_TYPE } from './tag.enum'

export class Loader {
    private loadingList: string[] = [];
    private apiUrl: string;

    constructor(private appsManager: AppsManager, private config: { [key: string]: any }) {
        this.apiUrl = config.registryApi;
        appsManager.subscribe(this.onNotFoundApp.bind(this));
    }

    onNotFoundApp(appList: {blocking: MicroAppDef[], nonBlocking: MicroAppDef[] }) {
        appList.blocking.forEach(({ name }) => {
            if (this.loadingList.indexOf(name) === -1) {
                this.loadingList.push(name);
                this.fetchMicroApp(name);
            }
        });
        appList.nonBlocking.forEach(({ name }) => {
            if (this.loadingList.indexOf(name) === -1) {
                this.loadingList.push(name);
                this.fetchMicroApp(name);
            }
        });
    }

    fetchMicroApp(microAppName: string) {
        if (!window || !window['fetch']) {
            return;
        }
        fetch(`${this.apiUrl}/registry/${microAppName}`)
            .then(result => result.json())
            .then(files => {
                files.forEach(({ type, file }) => {
                    switch (type) {
                        case 'css':
                            Loader.injectToHead(microAppName, file, TAG.style, TAG_TYPE.style);
                            break;
                        case 'js':
                            Loader.injectToHead(microAppName, file, TAG.script, TAG_TYPE.script);
                            break;
                    }
                });
            });
    }

    static injectToHead(microAppName: string, appContent: string, tag: TAG, type: TAG_TYPE) {
        const script = document.createElement(tag);
        const inlineScript = document.createTextNode(appContent);
        script.type = type;
        script.id = `${microAppName}_${tag}`;
        script.appendChild(inlineScript);
        document.getElementsByTagName('head')[0].appendChild(script);
    }
}

