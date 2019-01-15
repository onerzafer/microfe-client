export class Router {
    oldPath: string;
    private onChangeHandlers: Array<(oldPath: string, newPath: string) => void> = [];
    constructor(private routes: { [key: string]: any }) {
        window.onpopstate = e => {
            console.log('popstate', e);
            e.preventDefault();
            return false;
        };

        window.onhashchange = e => {
            console.log('hashchange', e);
        };

        this.navigate(window.location.pathname);
    }

    navigate(path: string) {
        const resolvedPath = this.resolve(path);
        if (this.oldPath !== resolvedPath) {
            if (this.isHit(resolvedPath)) {
                window.history.pushState(undefined, undefined, resolvedPath);
                this.changed(resolvedPath);
            } else {
                window.location.href = resolvedPath;
            }
        }
    }

    onChange(fn: (oldPath: string, newPath: string) => void) {
        this.onChangeHandlers.push(fn);
        if (this.oldPath) {
            fn.apply(null, [undefined, this.oldPath]);
        }
    }

    private changed(path: string) {
        this.onChangeHandlers.forEach(fn => {
            fn.apply(null, [this.oldPath, path]);
        });
        this.oldPath = path;
    }

    private isHit(path: string): boolean {
        return Object.keys(this.routes).includes(path);
    }

    private resolve(path: string): string {
        const pathObj = this.routes[path];
        if (pathObj && !pathObj.redirectTo) {
            return path;
        } else if (pathObj && pathObj.redirectTo) {
            return this.resolve(pathObj.redirectTo);
        } else {
            return undefined;
        }
    }
}
