import { AppsManager, MicroApp, MicroAppDef } from './AppsManager'

class Loader {
    constructor(private manager: AppsManager) {
        manager.subscribe(this.onNotFoundApp)
    }

    onNotFoundApp(appList: MicroAppDef[]) {
        console.log(appList);
    }
}

export const ResourceLoader: MicroApp = {
    name: 'Loader',
    initialize: function({ AppsManager}) {
        return new Loader(AppsManager);
    }
}
