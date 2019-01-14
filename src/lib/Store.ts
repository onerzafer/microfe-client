import { BehaviorSubject } from 'rxjs';
import { pluck, scan } from 'rxjs/operators';

export const Store = () => {
    const subject = new BehaviorSubject({});
    const source = subject.pipe(scan((state, action) => applyReducers(state, action), subject.value));
    let reducers = {};

    const applyReducers = (state, action) => {
        return Object.keys(reducers).reduce((cum, curr) => {
            return {
                ...cum,
                [curr]: reducers[curr](state[curr], action) || undefined,
            };
        }, {});
    };

    const addReducer = reducerTreePiece => {
        // TODO: validate the reducer schema
        reducers = {
            ...reducers,
            ...reducerTreePiece,
        };
    };

    const dispatch = (action: { type: string; payload: any }) => {
        subject.next(action);
    };

    const select = (...selector) => {
        return source.pipe(pluck(...selector));
    };

    return {
        dispatch,
        addReducer,
        select,
    };
};
