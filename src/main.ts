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
    [
        { path: '/', redirectTo: '/angular' },
        { path: '/angular', microApp: 'demoAngular', tagName: 'demo-angular' },
        { path: '/react', microApp: 'reactDemo', tagName: 'react-demo' },
        { path: '/static', microApp: 'staticApp', tagName: 'static-app' },
        { path: '*', microApp: 'NotFoundApp', tagName: 'not-found-app' },
    ],
    {
        registryApi: 'http://localhost:3000/registry', // must be declared
        registryPublic: 'http://localhost:3000', // must be declared
    }
);
