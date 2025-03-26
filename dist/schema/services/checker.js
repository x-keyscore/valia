"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckingQueue = void 0;
exports.checker = checker;
const mounter_1 = require("./mounter");
function makeReject(code, task) {
    return ({
        code,
        path: task.fullPaths,
        type: task.node.type,
        label: task.node.label,
        message: task.node.message
    });
}
class CheckingQueue extends Array {
    constructor(rootNode, rootData) {
        super();
        this.push({
            data: rootData,
            node: rootNode,
            fullPaths: { explicit: [], implicit: [] }
        });
    }
    pushChunk(sourceTask, chunk) {
        for (let i = 0; i < chunk.length; i++) {
            const task = chunk[i];
            const partPaths = task.node[mounter_1.nodeSymbol].partPaths;
            let listHooks = sourceTask.listHooks;
            if (task.hooks) {
                const hooks = {
                    sourceTask,
                    awaitTasks: 0,
                    queueIndex: {
                        self: this.length,
                        chunk: this.length - i
                    },
                    callbacks: task.hooks,
                };
                if (listHooks) {
                    listHooks = listHooks.concat(hooks);
                }
                else {
                    listHooks = [hooks];
                }
            }
            this.push({
                data: task.data,
                node: task.node,
                fullPaths: {
                    explicit: sourceTask.fullPaths.explicit.concat(partPaths.explicit),
                    implicit: sourceTask.fullPaths.implicit.concat(partPaths.implicit)
                },
                listHooks
            });
        }
    }
    execHooks(code, listHooks, chunkLength) {
        let reject = null;
        for (let i = listHooks.length - 1; i >= 0; i--) {
            const hooks = listHooks[i];
            // UPDATE AWAITING TASKS
            hooks.awaitTasks += chunkLength - 1;
            // RETURN IF TASKS REMAIN
            if (hooks.awaitTasks)
                return (null);
            // EXECUTE HOOKS
            let claim = null;
            if (code)
                claim = hooks.callbacks.onReject(code);
            else
                claim = hooks.callbacks.onAccept();
            if (claim.action === "REJECT") {
                this.length = hooks.queueIndex.self;
                code = claim.code;
                reject = makeReject(code, hooks.sourceTask);
            }
            if (claim.action === "IGNORE") {
                this.length = hooks.queueIndex.self;
                return (null);
            }
            if (claim.action === "RESET") {
                if (claim.before === "SELF")
                    this.length = hooks.queueIndex.self;
                else if (claim.before === "CHUNK")
                    this.length = hooks.queueIndex.chunk;
                return (null);
            }
        }
        return (reject);
    }
}
exports.CheckingQueue = CheckingQueue;
function checker(managers, rootNode, rootData) {
    const formats = managers.formats;
    const events = managers.events;
    const queue = new CheckingQueue(rootNode, rootData);
    let reject = null;
    while (queue.length) {
        const task = queue.pop();
        const { data, node, listHooks } = task;
        const chunk = [];
        let code = null;
        if (data === null) {
            if (node.nullable)
                code = null;
            else
                code = "TYPE_NULL";
        }
        else if (data === undefined) {
            if (node.undefinable)
                code = null;
            else
                code = "TYPE_UNDEFINED";
        }
        else {
            const format = formats.get(node.type);
            code = format.check(chunk, node, data);
        }
        if (listHooks === null || listHooks === void 0 ? void 0 : listHooks.length) {
            reject = queue.execHooks(code, listHooks, chunk.length);
            break;
        }
        else if (code) {
            reject = makeReject(code, task);
            break;
        }
        if (chunk.length) {
            queue.pushChunk(task, chunk);
        }
    }
    events.emit("DATA_CHECKED", rootNode, reject);
    return (reject);
}
;
