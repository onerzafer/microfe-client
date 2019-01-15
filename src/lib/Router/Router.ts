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
    }

    navigate(path: string) {
        if (this.isHit(path)) {
            window.history.pushState(undefined, undefined, path);
            this.changed(path);
        } else {
            window.location.href = path;
        }
    }

    onChange(fn: (oldPath: string, newPath: string) => void) {
        this.onChangeHandlers.push(fn);
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
}
