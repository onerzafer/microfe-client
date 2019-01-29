import { ResolvedRoute, Route } from '../Interfaces/Router.interface';
import { Microfe } from '../Decorators/Microfe.decorator';

@Microfe({
    deps: ['Routes'],
})
export class MicroAppRouter {
    private oldRoute: ResolvedRoute;
    private onChangeHandlers: Array<(oldPath: string, newPath: string) => void> = [];
    private routes: Array<Route>;

    constructor({ Routes }: { Routes: Array<Route> }) {
        this.routes = Routes;
        window.onpopstate = () => {
            this.navigate(window.location.pathname);
        };

        this.navigate(window.location.pathname, true);
    }

    navigate(path: string, isSilent: boolean = false) {
        const resolvedRoute = this.resolve(MicroAppRouter.cleanPath(path));
        if (resolvedRoute) {
            if (!this.oldRoute || this.oldRoute.path !== resolvedRoute.path) {
                if (!isSilent) {
                    window.history.pushState(undefined, undefined, resolvedRoute.path);
                }
                this.changed(resolvedRoute);
            }
        } else {
            window.location.href = MicroAppRouter.cleanPath(path);
        }
    }

    onChange(fn: (oldPath: string, newPath: string, resolvedRoute?: ResolvedRoute) => void) {
        this.onChangeHandlers.push(fn);
        if (this.oldRoute) {
            fn.apply(null, [undefined, this.oldRoute.path, this.oldRoute]);
        }
    }

    isActive(pathToCheck: string): boolean {
        return this.oldRoute && MicroAppRouter.isHit(this.oldRoute.route, MicroAppRouter.cleanPath(pathToCheck));
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
        const foundRoute = this.routes.find(route => MicroAppRouter.isHit(route, path));
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

    private static isHit(route: Route, path: string): boolean {
        return route.path === '/' ? route.path === path : MicroAppRouter.pathToRegexp(route.path).test(path);
    }

    private static pathToRegexp(path: string): RegExp {
        return new RegExp(`^${path.replace(/\\\//g, '/').replace('*', '.*?')}`);
    }

    private static cleanPath(path: string): string {
        return path && path.replace(new RegExp(window.location.origin), '');
    }
}
