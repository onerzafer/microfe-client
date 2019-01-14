const { container, MicroAppStore } = microAppArgs;

setInterval(() => {
    MicroAppStore.dispatch({ type: 'increment' });
}, 1000);

MicroAppStore.addReducer({
    tick: (state = 0, action) => {
        console.log(state, action);
        switch (action.type) {
            case 'increment':
                return state + 1;
            case 'decrement':
                return state - 1;
            case 'reset':
                return 0;
            default:
                return state;
        }
    },
});

const reactDemoAppElem = document.createElement('react-demo');
container.appendChild(reactDemoAppElem);

const demoAngularElm = document.createElement('demo-angular');
container.appendChild(demoAngularElm);
