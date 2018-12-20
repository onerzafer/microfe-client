import { AppsManager, MicroApp } from './lib/AppsManager';
import { ResourceLoader } from './lib/Loader';
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
    initialize: function(Layout) {
        const app = document.getElementById('app');
        Layout.exec(app);
    },
};

const manager = new AppsManager();
manager.register(ConfigProvider);
manager.register(ResourceLoader);
manager.register(MainApp);
