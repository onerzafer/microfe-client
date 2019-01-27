import { MicroAppRouter } from './Router';
import { Microfe } from '../Decorators/Microfe.decorator';

@Microfe({
    deps: ['MicroAppRouter'],
})
export class MicroLink {
    constructor({ MicroAppRouter }: { MicroAppRouter: MicroAppRouter }) {
        class MicroLinkElement extends HTMLElement {
            private styleText = `
                :host {
                    display: inline-block;
                    cursor: pointer;
                }
            `;
            constructor() {
                super();
                this.attachShadow({ mode: 'open' });
                MicroAppRouter.onChange(this.handleRouteChange);
                this.render();
            }

            get href() {
                return this.getAttribute('href');
            }

            set href(newValue) {
                this.setAttribute('href', newValue);
            }

            onclick = () => {
                MicroAppRouter.navigate(this.href);
            };

            handleRouteChange = () => {
                MicroAppRouter.isActive(this.href) ? this.classList.add('active') : this.classList.remove('active');
            };

            private render = () => {
                const styleElm = document.createElement('style');
                styleElm.innerHTML = this.styleText;
                this.shadowRoot.appendChild(styleElm);
                this.shadowRoot.appendChild(document.createElement('slot'));
            };
        }
        customElements.define('micro-link', MicroLinkElement);
    }
}
