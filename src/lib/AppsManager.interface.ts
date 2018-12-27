import { STATUS } from './status.enum';

export interface MicroApp {
    name: string;
    deps?: string[];
    nonBlockingDeps?: string[];
    initialize: (...deps) => void;
}

export interface MicroAppDef {
    name: string; // must be unique
    status: STATUS;
    deps: string[];
    nonBlockingDeps?: string[];
    app: MicroApp;
}

export interface MicroAppsGraph {
    [key: string]: MicroAppDef;
}

export interface BoolObj {
    [key: string]: boolean;
}

export interface AnyObj {
    [key: string]: any;
}
