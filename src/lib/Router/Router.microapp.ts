import { MicroApp } from '../AppsManager/AppsManager.interface';
import { Router } from './Router';
import { Loader } from '../Loader/Loader';
import { AppsManager } from '../AppsManager/AppsManager';

export const MicroAppRouter: MicroApp = {
    name: 'MicroAppRouter',
    deps: ['Loader'],
    initialize: ({ Loader, AppsManager }: { Loader: Loader; AppsManager: AppsManager }) => {
        class RouterOutlet extends HTMLElement {
            router: Router = new Router(AppsManager);
            constructor() {
                super();
            }
        }
        customElements.define('micro-router', RouterOutlet);
    },
};
