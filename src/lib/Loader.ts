import { AppsManager } from './AppsManager';
import { MicroAppDef } from './AppsManager.interface';
import { TAG, TAG_TYPE } from './tag.enum';

export class Loader {
    private loadingList: string[] = [];
    private apiUrl: string;

    constructor(private appsManager: AppsManager, private config: { [key: string]: any }) {
        this.apiUrl = config.registryApi;
        appsManager.subscribe(this.onNotFoundApp.bind(this));
    }

    onNotFoundApp(appList: { blocking: MicroAppDef[]; nonBlocking: MicroAppDef[] }) {
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
                    const id = `${microAppName}_${type}_${new Date().getTime()}`;
                    switch (type) {
                        case 'css':
                            Loader.injectCssToHead(id, file);
                            break;
                        case 'js':
                            Loader.injectJsToHead(id, file);
                            break;
                    }
                });
            });
    }

    static injectCssToHead(id: string, appContent: string) {
        const style = document.createElement(TAG.style) as HTMLStyleElement;
        style.id = id;
        style.type = TAG_TYPE.style;
        const styleTextContent = document.createTextNode(appContent);
        style.appendChild(styleTextContent);
        document.getElementsByTagName('head')[0].appendChild(style);
    }

    static injectJsToHead(id: string, appContent: string) {
        const script = document.createElement(TAG.script) as HTMLScriptElement;
        const scriptAsBlob = new Blob([appContent], { type: TAG_TYPE.script });
        script.id = id;
        script.type = TAG_TYPE.script;
        script.src = URL.createObjectURL(scriptAsBlob);
        document.getElementsByTagName('head')[0].appendChild(script);
    }
}
