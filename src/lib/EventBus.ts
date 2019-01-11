import { MicroApp } from './AppsManager.interface';
import { BehaviorSubject } from 'rxjs';

export const EventBus: MicroApp = {
    name: 'EventBus',
    initialize: function() {
        const source = new BehaviorSubject({});

        const dispatch = function(action: { type: string; payload: any }) {
            source.next(action);
        };

        const subscribe = function(handler) {
            return source.subscribe(handler);
        };

        return {
            dispatch,
            subscribe,
        };
    },
};
