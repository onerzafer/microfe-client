import { MicroApp } from '../AppsManager/AppsManager.interface';
import { Router } from './Router';
import { Loader } from '../Loader/Loader';
import { AppsManager } from '../AppsManager/AppsManager';
import { ResolvedRoute, Route } from './Router.interface';

export const MicroAppRouter: (routes: Route[]) => MicroApp = routes => ({
    name: 'MicroAppRouter',
    deps: ['Loader'],
    initialize: ({ Loader }: { Loader: Loader; AppsManager: AppsManager }) => {
        const router = new Router(routes);
        class RouterOutlet extends HTMLElement {
            router: Router = router;
            shadow = this.attachShadow({ mode: 'open' });
            constructor() {
                super();
                this.router.onChange((oldPath, newPath, resolvedRoute) =>
                    this.handlePath(oldPath, newPath, resolvedRoute)
                );
            }

            private handlePath(oldPath: string, newPath: string, resolvedRoute: ResolvedRoute) {
                if (resolvedRoute) {
                    Loader.fetchMicroApp(resolvedRoute.route.microApp);
                    const appTag = document.createElement(resolvedRoute.route.tagName);
                    while (this.shadow.firstChild) {
                        this.shadow.removeChild(this.shadow.firstChild);
                    }
                    this.shadow.appendChild(appTag);
                }
            }
        }
        customElements.define('micro-router', RouterOutlet);
        return router;
    },
});
