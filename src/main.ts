import { Microfe, Bootstrap, Route, ConfigInterface } from './lib';

@Microfe({
    deps: ['LayoutApp'],
})
class Main {
    constructor() {
        console.log('Initialised');
    }
}

const Routes: Route[] = [
    { path: '/', redirectTo: '/angular' },
    { path: '/angular', microApp: 'demoAngular', tagName: 'demo-angular' },
    { path: '/react', microApp: 'reactDemo', tagName: 'react-demo' },
    { path: '/static', microApp: 'staticApp', tagName: 'static-app' },
    { path: '*', microApp: 'NotFoundApp', tagName: 'not-found-app' },
];

const Config: ConfigInterface = {
    registryApi: 'http://localhost:3000/registry',
    registryPublic: 'http://localhost:3000',
};

Bootstrap(Routes, Config)(Main);
