(function(WINDOW, DOCUMENT) {
    window = undefined;
    if (WINDOW && WINDOW.AppsManager && WINDOW.AppsManager.register) {
        WINDOW.AppsManager.register({
            name: '__name__',
            deps: [__dependencies__],
            noneBlockingDeps: [__nonBlockingDependencies__],
            initialize: microAppArgs => {
                class __name__ extends HTMLElement {
                    constructor() {
                        super();
                        this.attachShadow({ mode: 'open' });

                        const root = DOCUMENT.createElement('iframe');
                        root.id = '__container_id__';
                        root.frameborder = '0';
                        root.scrolling = 'no';
                        root.style.border = '0px';
                        root.style.margin = '0px';
                        root.style.width = '100%';
                        root.onload = () => {
                            root.style.height = root.contentWindow.document.body.scrollHeight + 'px'
                        }
                        root.src = '__entryPoint__';
                        this.shadowRoot.appendChild(root);
                    }
                }
                customElements.define('__kebab-name__', __name__);
            },
        });
    }
})(window, document);
