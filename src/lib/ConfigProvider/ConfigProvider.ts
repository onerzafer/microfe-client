import { MicroApp } from '..';
import { ConfigInterface } from './Config.interface';

export const ConfigProvider: (config: ConfigInterface) => MicroApp = config => ({
    name: 'Config',
    initialize: () => config,
});
