(function(w, d) {
    if (w && w.AppsManager && w.AppsManager.register) {
        w.AppsManager.register({
            name: '__name__',
            deps: [__dependencies__],
            noneBlockingDeps: [__nonBlockingDependencies__],
            initialize: function(...microAppArgs) {
                const stylesAsText = `__stylesAsText__`;
                class __name__ extends HTMLElement {
                    constructor() {
                        super();
                        const shadow = this.attachShadow({ mode: 'open' });
                        if (stylesAsText && stylesAsText !== '') {
                            const style = d.createElement('style');
                            const styleTextNode = d.createTextNode(stylesAsText);
                            style.appendChild(styleTextNode);
                            shadow.appendChild(style);
                        }
                        const root = d.createElement('div');
                        root.id = '__container_id__';
                        shadow.appendChild(root);
                    }

                    connectedCallback() {
                        const MICROAPP_CONTAINER = this.shadowRoot.getElementById('__container_id__');
                        microAppArgs = [MICROAPP_CONTAINER, ...microAppArgs];
                        __appContentAsText__;
                    }
                }
                customElements.define('__kebab-name__', __name__);
            },
        });
    }
})(window, document);
