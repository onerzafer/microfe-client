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
    deps: ['fakeApp1'],
    initialize: function(fakeApp1) {
        console.log(fakeApp1.exec('param1', 'param2'));
    },
};

const manager = new AppsManager();
manager.register(ConfigProvider);
manager.register(ResourceLoader);
manager.register(MainApp);
