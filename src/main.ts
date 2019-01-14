import { MicroApp } from './lib/AppsManager/AppsManager.interface';
import { MicroAppInitInfrastructure } from './lib/Infrastructure/InitInfrastructure';

const MainApp: MicroApp = {
    name: 'Main',
    deps: ['LayoutApp'],
    initialize: function() {
        console.log('initialized');
    },
};

// INITIALIZE
MicroAppInitInfrastructure(MainApp, { registryApi: 'http://localhost:9000' });
