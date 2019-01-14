import { MicroApp } from '../AppsManager/AppsManager.interface';

export const ConfigProvider: (config: { [key: string]: any }) => MicroApp = (config = {}) => ({
    name: 'Config',
    initialize: () => ({
        ...config,
    }),
});
