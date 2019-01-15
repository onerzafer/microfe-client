import { MicroApp } from '../AppsManager/AppsManager.interface';
import { AppsManager } from '../AppsManager/AppsManager';
import { MicroAppStore } from '../Store/Store.microapp';
import { ResourceLoader } from '../Loader/Loader.microapp';
import { MicroAppRouter } from '../Router/Router.microapp';
import { ConfigProvider } from '../ConfigProvider/ConfigProvider';

export const MicroAppInitInfrastructure = (
    entryApp: MicroApp,
    config?: { [key: string]: any },
    routes?: { [key: string]: any }
) => {
    const manager = new AppsManager();
    manager.register(ConfigProvider(config));
    manager.register(MicroAppStore);
    manager.register(ResourceLoader);
    manager.register(MicroAppRouter(routes));
    manager.register(entryApp);
};
