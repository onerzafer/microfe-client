(function(WINDOW, DOCUMENT) {
    window = undefined;
    if (WINDOW && WINDOW.AppsManager && WINDOW.AppsManager.register) {
        WINDOW.AppsManager.register({
            name: '__name__',
            deps: [__dependencies__],
            noneBlockingDeps: [__nonBlockingDependencies__],
            initialize: (microAppArgs) => {
                const stylesAsText = `__stylesAsText__`;
                class __name__ extends HTMLElement {
                    constructor() {
                        super();
                        const shadow = this.attachShadow({ mode: 'open' });
                        if (stylesAsText && stylesAsText !== '') {
                            const style = DOCUMENT.createElement('style');
                            const styleTextNode = DOCUMENT.createTextNode(stylesAsText);
                            style.appendChild(styleTextNode);
                            shadow.appendChild(style);
                        }
                        const root = DOCUMENT.createElement('app-root');
                        root.id = '__container_id__';
                        shadow.appendChild(root);
                    }

                    connectedCallback() {
                        const MICROAPP_CONTAINER = this.shadowRoot.getElementById('__container_id__');
                        microAppArgs['container'] = MICROAPP_CONTAINER;
                        __appContentAsText__;
                    }
                }
                customElements.define('__kebab-name__', __name__);
            },
        });
    }
})(window, document);
