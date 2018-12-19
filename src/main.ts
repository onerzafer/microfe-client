import { AppsManager, MicroApp } from './lib/AppsManager';
import { ResourceLoader } from './lib/Loader'

const fakeMicroApp1: MicroApp = {
    name: 'fakeMicroApp1',
    deps: ['fakeMicroApp2', 'fakeMicroApp3'],
    initialize: function({ fakeMicroApp2, fakeMicroApp3}) {
        fakeMicroApp2.say('fakeMicroApp1 rocks');
        fakeMicroApp3.say('fakeMicroApp1 rocks');
        return {
            say: text => {
                console.log('talking via fakeMicroApp1:', text);
            },
        };
    },
};

const fakeMicroApp2: MicroApp = {
    name: 'fakeMicroApp2',
    deps: ['fakeMicroApp3'],
    initialize: function({ fakeMicroApp3 }) {
        fakeMicroApp3.say('fakeMicroApp2 rocks');
        return {
            say: text => {
                console.log('talking via fakeMicroApp2:', text);
            },
        };
    },
};

const fakeMicroApp3: MicroApp = {
    name: 'fakeMicroApp3',
    initialize: function() {
        return {
            say: text => {
                console.log('talking via fakeMicroApp3:', text);
            },
        };
    },
};

const manager = new AppsManager();
manager.register(ResourceLoader);

setTimeout(() => manager.register(fakeMicroApp1), 5000);
setTimeout(() => manager.register(fakeMicroApp2), 500);
setTimeout(() => manager.register(fakeMicroApp3), 1000);
