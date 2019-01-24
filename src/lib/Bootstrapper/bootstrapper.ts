import { AppsManager } from '../AppsManager/AppsManager';
import { MicroAppRouter } from '../Router/Router.microapp';
import { ConfigProvider } from '../ConfigProvider/ConfigProvider';
import { Route } from '..';
import { Loader } from '../Loader/Loader';
import { MicroAppStore } from '../Store/MicroAppStore';

export const Bootstrap = (
    routes?: Route[],
    config?: { registryApi: string; registryPublic: string; [key: string]: any }
) => (...entryApps: any[]) => {
    const manager = new AppsManager();
    manager.register(ConfigProvider(config));
    manager.register(MicroAppStore);
    manager.register(Loader);
    manager.register(MicroAppRouter(routes || []));
    entryApps.forEach(entryApp => {
        manager.register(entryApp);
    });
};
