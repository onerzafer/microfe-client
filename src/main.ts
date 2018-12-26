import { AppsManager} from './lib/AppsManager';
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
    deps: ['reactApp'],
    initialize: function(reactApp) {
        const app = document.getElementById('app');
        console.log(reactApp);
    },
};

// INITIALIZE
const manager = new AppsManager();
manager.register(ConfigProvider);
manager.register(ResourceLoader);
manager.register(MainApp);
