import { MicroApp } from '../AppsManager/AppsManager.interface';
import { Router } from './Router';
import { Loader } from '../Loader/Loader';
import { AppsManager } from '../AppsManager/AppsManager';

export const MicroAppRouter: (routes: { [key: string]: any }) => MicroApp = (routes = {}) => ({
    name: 'MicroAppRouter',
    deps: ['Loader'],
    initialize: ({ Loader }: { Loader: Loader; AppsManager: AppsManager }) => {
        const router = new Router(routes);
        class RouterOutlet extends HTMLElement {
            router: Router = router;
            shadow = this.attachShadow({ mode: 'open' });
            constructor() {
                super();
                this.router.onChange((oldPath, newPath) => this.handlePath(oldPath, newPath));
            }

            private handlePath(oldPath: string, newPath: string) {
                const resolvedPath = routes[newPath];
                Loader.fetchMicroApp(resolvedPath.microApp);
                const appTag = document.createElement(resolvedPath.tagName);
                while (this.shadow.firstChild) {
                    this.shadow.removeChild(this.shadow.firstChild);
                }
                this.shadow.appendChild(appTag);
            }
        }
        customElements.define('micro-router', RouterOutlet);
        return router;
    },
});
