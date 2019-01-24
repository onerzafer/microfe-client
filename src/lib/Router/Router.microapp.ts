import { MicroAppProvider } from '..';
import { Router } from './Router';
import { Loader } from '../Loader/Loader';
import { ResolvedRoute, Route } from './Router.interface';

export const MicroAppRouter: (routes: Route[]) => MicroAppProvider = routes => ({
    name: 'MicroAppRouter',
    deps: ['Loader'],
    initialize: ({ Loader }: { Loader: Loader }) => {
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
