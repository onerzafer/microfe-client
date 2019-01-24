import { AppsManager } from '../AppsManager/AppsManager';
import { TAG, TAG_TYPE } from '../AppsManager/tag.enum';
import { Microfe } from '../Decorators/Microfe.decorator';
import { MicroAppDef } from '../Interfaces/AppsManager.internal.interface';
import { ConfigInterface } from '../Interfaces/Config.interface';

@Microfe({
    deps: ['Config']
})
export class Loader {
    private loadingList: string[] = [];
    private readonly apiUrl: string = '';
    private appsManager: AppsManager;
    constructor({AppsManager, Config}: {AppsManager: AppsManager, Config: ConfigInterface}) {
        this.apiUrl = (Config && Config.registryApi) || '';
        this.appsManager = AppsManager;
        this.appsManager.subscribe(this.onNotFoundApp.bind(this));
    }

    onNotFoundApp(appList: MicroAppDef[]) {
        appList.forEach(({ name }) => {
            if (this.loadingList.indexOf(name) === -1) {
                this.loadingList.push(name);
                this.fetchMicroApp(name);
            }
        });
    }

    fetchMicroApp(microAppName: string) {
        if (!this.appsManager.isDefinedBefore(microAppName)) {
            const id = `${microAppName}_js_${new Date().getTime()}`;
            Loader.injectJsToHead(id, `${this.apiUrl}/${microAppName}.js`);
        }
    }

    static injectJsToHead(id: string, appUrl: string) {
        const script = document.createElement(TAG.script) as HTMLScriptElement;
        script.id = id;
        script.type = TAG_TYPE.script;
        script.src = appUrl;
        script.setAttribute('async', '');
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(script, firstScriptTag);
    }
}
