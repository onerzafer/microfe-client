import { STATUS } from './status.enum';

export interface MicroAppMeta {
    deps?: string[];
}

export interface MicroApp extends MicroAppMeta {
    name: string;
    initialize: (...deps) => void;
}

export interface MicroAppDef {
    name: string; // must be unique
    status: STATUS;
    deps: string[];
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
