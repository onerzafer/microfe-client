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
MicroAppInitInfrastructure(
    MainApp,
    { registryApi: 'http://localhost:9000' },
    {
        '/': { redirectTo: '/angular' },
        '/react': { microApp: 'reactDemo', tagName: 'react-demo' },
        '/react/*': { microApp: 'reactDemo', tagName: 'react-demo' },
        '/react/some/app/*': { microApp: 'reactDemo', tagName: 'react-demo' },
        '/angular': { microApp: 'demoAngular', tagName: 'demo-angular' },
    }
);
