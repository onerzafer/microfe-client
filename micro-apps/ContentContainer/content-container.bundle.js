const { container, EventBus } = microAppArgs;

let counter = 0;
setInterval(() => {
    EventBus.dispatch({ type: 'tick', payload: counter++ });
}, 1000);

const reactDemoAppElem = document.createElement('react-demo');
container.appendChild(reactDemoAppElem);

const demoAngularElm = document.createElement('demo-angular');
container.appendChild(demoAngularElm);
