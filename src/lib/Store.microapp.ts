import { MicroApp } from './AppsManager.interface';
import { Store } from './Store';

export const MicroAppStore: MicroApp = {
    name: 'MicroAppStore',
    initialize: Store,
};
