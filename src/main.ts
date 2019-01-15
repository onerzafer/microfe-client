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
        { path: '/angular/*', microApp: 'demoAngular', tagName: 'demo-angular' },
        { path: '/angular', microApp: 'demoAngular', tagName: 'demo-angular' },
        { path: '/react', microApp: 'reactDemo', tagName: 'react-demo' },
        { path: '/react/*', microApp: 'reactDemo', tagName: 'react-demo' },
        { path: '/react/abc/*', microApp: 'reactDemo', tagName: 'react-demo' },
        { path: '*', microApp: 'NotFoundApp', tagName: 'not-found-app' },
    ],
    { registryApi: 'http://localhost:9000' }
);
