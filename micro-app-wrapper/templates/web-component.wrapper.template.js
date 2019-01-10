(function(WINDOW, DOCUMENT) {
    window = undefined;
    if (WINDOW && WINDOW.AppsManager && WINDOW.AppsManager.register) {
        WINDOW.AppsManager.register({
            name: '__name__',
            deps: [__dependencies__],
            noneBlockingDeps: [__nonBlockingDependencies__],
            initialize: function(...microAppArgs) {
                __appContentAsText__;
            },
        });
    }
})(window, document);
