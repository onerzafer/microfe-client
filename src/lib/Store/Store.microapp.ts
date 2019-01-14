import { MicroApp } from '../AppsManager/AppsManager.interface';
import { Store } from './Store';

export const MicroAppStore: MicroApp = {
    name: 'MicroAppStore',
    initialize: Store,
};
