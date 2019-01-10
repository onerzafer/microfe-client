import { AppsManager } from './lib/AppsManager';
import { ResourceLoader } from './lib/Loader.microapp';
import { MicroApp } from './lib/AppsManager.interface';

// TEST & DEV MICRO APPS
const ConfigProvider: MicroApp = {
    name: 'Config',
    initialize: () => ({
        registryApi: 'http://localhost:9000',
    }),
};

const MainApp: MicroApp = {
    name: 'Main',
    deps: ['LayoutApp'],
    initialize: function() {
        console.log('initialized');
    },
};

// INITIALIZE
const manager = new AppsManager();
manager.register(ConfigProvider);
manager.register(ResourceLoader);
manager.register(MainApp);
