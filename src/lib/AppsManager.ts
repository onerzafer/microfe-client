enum STATUS {
    NOTFOUND = 0,
    WAITING = 1,
    READY = 2,
    RUNNING = 3,
}

export interface MicroApp {
    name: string;
    deps?: string[];
    initialize: (deps: { [key: string]: any }) => void;
}

export interface MicroAppDef {
    name: string; // must be unique
    status: STATUS.READY | STATUS.WAITING | STATUS.RUNNING | STATUS.NOTFOUND;
    deps: string[];
    dependants: string[];
    app: MicroApp;
}

interface MicroAppsGraph {
    [key: string]: MicroAppDef;
}

interface BoolObj {
    [key: string]: boolean;
}

interface AnyObj {
    [key: string]: any;
}

export class AppsManager {
    private microAppsGraph: MicroAppsGraph = {};
    private instanceCache: AnyObj = {};
    private subscriptions: Array<(appList: MicroAppDef[]) => void> = [];

    register(microApp: MicroApp) {
        const microAppDef = this.generateMicroAppDef(microApp);
        const tempGraph = { ...this.microAppsGraph, [microAppDef.name]: microAppDef };
        if (this.microAppsGraph[microAppDef.name] && this.microAppsGraph[microAppDef.name].status !== STATUS.NOTFOUND) {
            console.error(`[Conflict error]: "${microAppDef.name}" is defined before.`);
            return;
        }
        if (this.isCyclic(microAppDef.name, undefined, undefined, tempGraph)) {
            const deps = microApp.deps.join(', ');
            console.error(`[Dependency error]: "${microApp.name}" has cyclic dependency. Check "${deps}"`);
            return;
        }
        this.addMicroAppToTree(microAppDef);
        microAppDef.deps.forEach(microAppName => {
            const dep = this.microAppsGraph[microAppName];
            if (!dep) {
                this.addMicroAppToTree(this.generatePlaceholderMicroAppDef(microAppName));
            } else {
                dep.dependants = this.findDependants(microAppName);
            }
        });
        this.updateMicroAppStatuses();
        this.runReadyMicroApps();
        this.dispatch();
    }

    subscribe(fn: (appList: MicroAppDef[]) => void){
        this.subscriptions.push(fn);
    }

    dispatch() {
        const notFoundList = Object.keys(this.microAppsGraph)
            .map(microAppName => this.microAppsGraph[microAppName])
            .filter(microApp => microApp.status === STATUS.NOTFOUND)
        if(notFoundList.length === 0) {
            return;
        }
        this.subscriptions.forEach(fn => {
            fn.call(null, notFoundList);
        })
    }

    private generateMicroAppDef(microApp: MicroApp): MicroAppDef {
        return {
            name: microApp.name,
            status: microApp.deps ? STATUS.WAITING : STATUS.READY,
            deps: microApp.deps ? [...microApp.deps] : [],
            dependants: this.findDependants(microApp.name),
            app: microApp,
        };
    }

    private checkDepsRunning(microApp: MicroAppDef): boolean {
        return microApp.deps.length && microApp.deps
            .filter(microAppName => this.microAppsGraph[microAppName].status === STATUS.RUNNING)
            .length === microApp.deps.length;
    }

    private generatePlaceholderMicroAppDef(name: string): MicroAppDef {
        return {
            name,
            status: STATUS.NOTFOUND,
            deps: [],
            dependants: this.findDependants(name),
            app: undefined,
        };
    }

    private findDependants(name: string): string[] {
        return (
            Object.keys(this.microAppsGraph).filter(
                microAppName => this.microAppsGraph[microAppName].deps.indexOf(name) > -1
            ) || []
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

    private addMicroAppToTree(microApp: MicroAppDef) {
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
            .filter(microAppName => this.microAppsGraph[microAppName].status === STATUS.READY)
            .forEach(microAppName => {
                const deps = this.provideDepsInstances(this.microAppsGraph[microAppName].deps);
                this.instanceCache[microAppName] = new this.microAppsGraph[microAppName].app.initialize(deps);
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

    private provideDepsInstances(deps: string[]): AnyObj {
        return deps.reduce((cum, cur) => {
            let instance = this.instanceCache[cur];
            return {
                ...cum,
                [cur]: instance || undefined,
            };
        }, {AppsManager: this});
    }
}
