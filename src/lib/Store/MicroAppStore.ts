import { BehaviorSubject } from 'rxjs';
import { pluck, scan } from 'rxjs/operators';
import { Microfe } from '../Decorators/Microfe.decorator';

@Microfe()
export class MicroAppStore  {
    private subject = new BehaviorSubject({});
    private source = this.subject.pipe(scan((state, action) => this.applyReducers(state, action), this.subject.value));
    private reducers = {};

    constructor() {
        this.dispatch({type: '[@@MicroAppStore]: Init'});
    }

    private applyReducers(state, action) {
        return Object.keys(this.reducers).reduce((cum, curr) => {
            return {
                ...cum,
                [curr]: this.reducers[curr](state[curr], action) || undefined,
            };
        }, {});
    }

    public addReducer(reducerTreePiece) {
        // TODO: validate the reducer schema
        this.reducers = {
            ...this.reducers,
            ...reducerTreePiece,
        };
    }

    public dispatch(action: { type: string; payload?: any }) {
        this.subject.next(action);
    }

    public select(...selector) {
        return this.source.pipe(pluck(...selector));
    }
}
