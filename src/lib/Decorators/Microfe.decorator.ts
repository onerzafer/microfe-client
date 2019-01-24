import { MicroAppMeta } from '..';

export const Microfe = function(meta?: MicroAppMeta ) {
    return function(WrappedClass) {
        WrappedClass.deps = meta && meta.deps;
        WrappedClass.initialize = (args) => new WrappedClass(args);
    };
};
