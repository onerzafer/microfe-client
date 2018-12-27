import { AppsManager } from './lib/AppsManager';
import { ResourceLoader } from './lib/Loader.microapp';
import { MicroApp } from './lib/AppsManager.interface';

// TEST & DEV MICRO APPS
const ConfigProvider: MicroApp = {
    name: 'Config',
    initialize: function() {
        return {
            registryApi: 'http://localhost:3000',
        };
    },
};

const MainApp: MicroApp = {
    name: 'Main',
    deps: ['Layout'],
    initialize: function(...args) {
        const [Loader] = args;
        Loader.run(document.getElementById('app'));
    },
};

// INITIALIZE
const manager = new AppsManager();
manager.register(ConfigProvider);
manager.register(ResourceLoader);
manager.register(MainApp);
