import { STATUS } from './status.enum';
import { MicroAppProvider } from './AppsManager.interface';

export interface MicroAppDef {
    name: string; // must be unique
    status: STATUS;
    deps: string[];
    app: MicroAppProvider;
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
