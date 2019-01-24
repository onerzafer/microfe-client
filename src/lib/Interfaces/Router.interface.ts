export interface Route {
    path: string;
    tagName?: string;
    redirectTo?: string;
    microApp?: string;
}

export interface ResolvedRoute {
    path: string;
    resolvedPath: string;
    route: Route;
    query?: {[key: string]: string | number | boolean};
    hash?: string;
}
