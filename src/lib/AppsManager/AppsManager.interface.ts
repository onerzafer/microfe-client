export interface MicroAppMeta {
    deps?: string[];
}

export interface MicroAppProvider extends MicroAppMeta {
    name: string;
    initialize: (deps: {[key: string]: any}) => void;
}
