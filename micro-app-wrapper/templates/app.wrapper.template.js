(function(w, d) {
    if (w && w.AppsManager && w.AppsManager.register) {
        w.AppsManager.register({
            name: "__name__",
            deps: [__dependencies__],
            noneBlockingDeps: [__nonBlockingDependencies__],
            initialize: function(...d) {
                return function(...a) {
                    const stylesAsText = `__stylesAsText__`;
                    const [...microAppArgs] = [...a, ...d];
                    class __name__ extends HTMLElement {
                        // Specify observed attributes so that
                        // attributeChangedCallback will work
                        static get observedAttributes() {
                          return ['c', 'l'];
                        }
                      
                        constructor() {
                          // Always call super first in constructor
                          super();
                      
                          const shadow = this.attachShadow({mode: 'open'});
                          if(stylesAsText && stylesAsText !== "") {
                              const style = document.createElement('style');
                              const styleTextNode = document.createTextNode(stylesAsText);
                              style.appendChild(styleTextNode);
                              shadow.appendChild(style);
                          }
                          const root = document.createElement('div');
                          root.id = "app-root";
                          shadow.appendChild(root);
                        }
                      
                        connectedCallback() {
                          console.log('Custom __name__ element added to page.');
                          const container = this.shadowRoot.getElementById("app-root");
                          __appContentAsText__
                        }
                      
                        disconnectedCallback() {
                          console.log('Custom __name__ element removed from page.');
                        }
                      
                        adoptedCallback() {
                          console.log('Custom __name__ element moved to new page.');
                        }
                      
                        attributeChangedCallback(name, oldValue, newValue) {
                          console.log('Custom __name__ element attributes changed.');
                        }
                      }
                      customElements.define('__kebab-name__', __name__);
                };
            },
        });
    }
})(window, document);
