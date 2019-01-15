import { STATUS } from './status.enum';
import { AnyObj, BoolObj, MicroApp, MicroAppDef, MicroAppsGraph } from './AppsManager.interface';

export class AppsManager {
    private microAppsGraph: MicroAppsGraph = {};
    private instanceCache: AnyObj = {};
    private subscriptions: Array<(appList: MicroAppDef[]) => void> = [];

    constructor() {
        window['AppsManager'] = this;
    }

    register(microApp: MicroApp) {
        const microAppDef = AppsManager.generateMicroAppDef(microApp);
        const tempGraph = { ...this.microAppsGraph, [microAppDef.name]: microAppDef };
        if (this.isDefinedBefore(microAppDef.name)) {
            console.error(`[Conflict error]: "${microAppDef.name}" is defined before.`);
            return;
        }
        if (this.isCyclic(microAppDef.name, undefined, undefined, tempGraph)) {
            const deps = microApp.deps.join(', ');
            console.error(`[Dependency error]: "${microApp.name}" has cyclic dependency. Check "${deps}"`);
            return;
        }
        this.addMicroAppToGraph(microAppDef);
        microAppDef.deps.forEach(microAppName => {
            const dep = this.microAppsGraph[microAppName];
            if (!dep) {
                this.addMicroAppToGraph(AppsManager.generatePlaceholderMicroAppDef(microAppName));
            }
        });
        microAppDef.nonBlockingDeps.forEach(microAppName => {
            const dep = this.microAppsGraph[microAppName];
            if (!dep) {
                this.addMicroAppToGraph(AppsManager.generateNonBlockingPlaceholderMicroAppDef(microAppName));
            }
        });
        this.updateMicroAppStatuses();
        this.runReadyMicroApps();
        this.dispatch();
    }

    isDefinedBefore(microAppName: string): boolean {
        return this.microAppsGraph[microAppName] && this.microAppsGraph[microAppName].status !== STATUS.NOTFOUND;
    }

    subscribe(fn: (appList: MicroAppDef[]) => void) {
        this.subscriptions.push(fn);
    }

    dispatch() {
        const appList = Object.keys(this.microAppsGraph).map(microAppName => this.microAppsGraph[microAppName]);
        const notFoundList = appList.filter(microApp => microApp.status === STATUS.NOTFOUND);
        const nonBlockingList = appList.filter(microApp => microApp.status === STATUS.NON_BLOCKING);
        if (notFoundList.length === 0 && nonBlockingList.length === 0) {
            return;
        }
        this.subscriptions.forEach(fn => {
            fn.call(null, { blocking: notFoundList, nonBlocking: nonBlockingList });
        });
    }

    private checkDepsRunning(microApp: MicroAppDef): boolean {
        return (
            !microApp.deps.length ||
            (microApp.deps.length &&
                microApp.deps.filter(microAppName => {
                    return this.microAppsGraph[microAppName].status === STATUS.RUNNING;
                }).length === microApp.deps.length)
        );
    }

    private isCyclic(vertex: string, visited: BoolObj = {}, recStack: BoolObj = {}, list: MicroAppsGraph): boolean {
        if (!visited[vertex]) {
            visited[vertex] = true;
            recStack[vertex] = true;
            const neighbours = (list[vertex] && list[vertex].deps) || [];
            for (let i = 0; i < neighbours.length; i++) {
                const current = neighbours[i];
                if (!visited[current] && this.isCyclic(current, visited, recStack, list)) {
                    return true;
                } else if (recStack[current]) {
                    return true;
                }
            }
        }
        recStack[vertex] = false;
        return false;
    }

    private addMicroAppToGraph(microApp: MicroAppDef) {
        if (!this.microAppsGraph[microApp.name]) {
            this.microAppsGraph = { ...this.microAppsGraph, [microApp.name]: microApp };
        } else {
            this.microAppsGraph = {
                ...this.microAppsGraph,
                [microApp.name]: {
                    ...this.microAppsGraph[microApp.name],
                    ...microApp,
                },
            };
        }
    }

    private runReadyMicroApps() {
        let hasSomethingRun = false;
        Object.keys(this.microAppsGraph)
            .filter(
                microAppName =>
                    this.microAppsGraph[microAppName].status === STATUS.READY && this.microAppsGraph[microAppName].app
            )
            .forEach(microAppName => {
                const deps = this.provideDepsInstances(this.microAppsGraph[microAppName].deps);
                this.instanceCache[microAppName] = this.microAppsGraph[microAppName].app.initialize(deps);
                this.microAppsGraph[microAppName].status = STATUS.RUNNING;
                hasSomethingRun = true;
            });
        if (hasSomethingRun) {
            this.updateMicroAppStatuses();
        }
    }

    private updateMicroAppStatuses() {
        let hasUpdated = false;
        Object.keys(this.microAppsGraph)
            .filter(microAppName => this.microAppsGraph[microAppName].status === STATUS.WAITING)
            .forEach(microAppName => {
                if (this.checkDepsRunning(this.microAppsGraph[microAppName])) {
                    this.microAppsGraph[microAppName].status = STATUS.READY;
                    hasUpdated = true;
                }
            });
        if (hasUpdated) {
            this.runReadyMicroApps();
        }
    }

    private provideDepsInstances(deps: string[]): { [key: string]: any } {
        return deps.reduce(
            (cumulative, current) => {
                return {
                    ...cumulative,
                    [current]: this.instanceCache[current],
                };
            },
            { AppsManager: this }
        );
    }

    static generateMicroAppDef(microApp: MicroApp): MicroAppDef {
        return {
            name: microApp.name,
            status: microApp.deps ? STATUS.WAITING : STATUS.READY,
            deps: microApp.deps ? [...microApp.deps] : [],
            nonBlockingDeps: microApp.deps ? [...microApp.deps] : [],
            app: microApp,
        };
    }

    static generatePlaceholderMicroAppDef(name: string): MicroAppDef {
        return {
            name,
            status: STATUS.NOTFOUND,
            deps: [],
            app: undefined,
        };
    }

    static generateNonBlockingPlaceholderMicroAppDef(name: string): MicroAppDef {
        return {
            name,
            status: STATUS.NON_BLOCKING,
            deps: [],
            app: undefined,
        };
    }
}
