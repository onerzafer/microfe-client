import { MicroApp } from '../AppsManager/AppsManager.interface';
import { Loader } from './Loader';

export const ResourceLoader: MicroApp = {
    deps: ['Config'],
    name: 'Loader',
    initialize: function({AppsManager, Config}) {
        return new Loader(AppsManager, Config);
    },
};
