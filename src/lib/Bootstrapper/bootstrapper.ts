import { AppsManager } from '../AppsManager/AppsManager';
import { Route } from '..';
import { Loader } from '../Loader/Loader';
import { MicroAppStore } from '../Store/MicroAppStore';
import { RouterOutlet } from '../Router/RouterOutlet';
import { MicroAppRouter } from '../Router/Router';
import { Provide } from '../Provider/Provider';

export const Bootstrap = (
    routes?: Route[],
    config?: { registryApi: string; registryPublic: string; [key: string]: any }
) => (...entryApps: any[]) => {

    if(!entryApps.length) {
        throw new Error('At least one entry app should be provided');
    }

    const manager = new AppsManager();
    manager.register(Provide('Routes', routes || []));
    manager.register(RouterOutlet);
    manager.register(Provide('Config', config));
    manager.register(MicroAppStore);
    manager.register(Loader);
    manager.register(MicroAppRouter);
    entryApps.forEach(entryApp => {
        manager.register(entryApp);
    });
};
