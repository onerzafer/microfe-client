import { MicroApp } from './AppsManager.interface'
import { Loader } from './Loader'

export const ResourceLoader: MicroApp = {
    deps: ['Config'],
    name: 'Loader',
    initialize: function(Config, AppsManager) {
        return new Loader(AppsManager, Config)
    },
}
