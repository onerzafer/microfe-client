import { MicroAppProvider } from '..';
import { ConfigInterface } from './Config.interface';

export const ConfigProvider: (config: ConfigInterface) => MicroAppProvider = config => ({
    name: 'Config',
    initialize: () => config,
});
