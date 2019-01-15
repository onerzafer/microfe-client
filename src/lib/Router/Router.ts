import { ResolvedRoute, Route } from './Router.interface';

export class Router {
    private oldRoute: ResolvedRoute;
    private onChangeHandlers: Array<(oldPath: string, newPath: string) => void> = [];

    constructor(private routes: Route[]) {
        window.onpopstate = () => {
            this.navigate(window.location.pathname);
        };

        this.navigate(window.location.pathname, true);
    }

    navigate(path: string, isSilent: boolean = false) {
        const resolvedRoute = this.resolve(this.cleanPath(path));
        if (resolvedRoute) {
            if (!this.oldRoute || this.oldRoute.path !== resolvedRoute.path) {
                if (!isSilent) {
                    window.history.pushState(undefined, undefined, resolvedRoute.path);
                }
                this.changed(resolvedRoute);
            }
        } else {
            window.location.href = this.cleanPath(path);
        }
    }

    onChange(fn: (oldPath: string, newPath: string, resolvedRoute?: ResolvedRoute) => void) {
        this.onChangeHandlers.push(fn);
        if (this.oldRoute) {
            fn.apply(null, [undefined, this.oldRoute.path, this.oldRoute]);
        }
    }

    isActive(pathToCheck: string): boolean {
        return this.oldRoute && this.isHit(this.oldRoute.route, this.cleanPath(pathToCheck));
    }

    private cleanPath(path: string): string {
        return path.replace(new RegExp(window.location.origin), '');
    }

    private changed(resolvedRoute: ResolvedRoute) {
        const oldPath = this.oldRoute && this.oldRoute.path;
        this.oldRoute = {
            ...resolvedRoute,
        };
        this.onChangeHandlers.forEach(fn => {
            fn.apply(null, [oldPath, resolvedRoute.path, resolvedRoute]);
        });
    }

    private resolve(path: string): ResolvedRoute {
        const foundRoute = this.routes.find(route => this.isHit(route, path));
        if (foundRoute && !foundRoute.redirectTo) {
            return {
                path: path,
                resolvedPath: foundRoute.path,
                route: {
                    ...foundRoute,
                },
            };
        } else if (foundRoute && foundRoute.redirectTo) {
            return this.resolve(foundRoute.redirectTo);
        } else {
            return undefined;
        }
    }

    private isHit(route: Route, path: string): boolean {
        return route.path === '/' ? route.path === path : this.pathToRegexp(route.path).test(path);
    }

    private pathToRegexp(path: string): RegExp {
        return new RegExp(`^${path.replace(/\\\//g, '/').replace('*', '.*?')}`);
    }
}
