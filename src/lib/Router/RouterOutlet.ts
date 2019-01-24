import { Loader } from '../Loader/Loader';
import { MicroAppRouter } from './Router';
import { ResolvedRoute } from '../Interfaces/Router.interface';
import { Microfe } from '../Decorators/Microfe.decorator';

@Microfe({
    deps: ['Loader', 'MicroAppRouter'],
})
export class RouterOutlet {
    constructor({ Loader, MicroAppRouter }: { Loader: Loader; MicroAppRouter: MicroAppRouter }) {
        class RouterOutletElement extends HTMLElement {
            shadow = this.attachShadow({ mode: 'open' });
            constructor() {
                super();
                MicroAppRouter.onChange((oldPath, newPath, resolvedRoute) =>
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
        customElements.define('micro-router', RouterOutletElement);
    }
}
