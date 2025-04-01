"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckingStack = void 0;
exports.checker = checker;
const mounter_1 = require("./mounter");
function makeReject(task, code) {
    return ({
        code,
        path: task.fullPaths,
        type: task.node.type,
        label: task.node.label,
        message: task.node.message
    });
}
class CheckingStack {
    constructor(rootNode, rootData) {
        this.tasks = [];
        this.tasks.push({
            data: rootData,
            node: rootNode,
            fullPaths: { explicit: [], implicit: [] }
        });
    }
    addChunk(sourceTask, chunk) {
        for (let i = 0; i < chunk.length; i++) {
            const currentTask = chunk[i];
            const partPaths = currentTask.node[mounter_1.nodeSymbol].partPaths;
            let stackHooks = sourceTask.stackHooks;
            if (currentTask.hooks) {
                const hooks = {
                    owner: sourceTask,
                    index: {
                        chunk: this.tasks.length - i,
                        branch: this.tasks.length
                    },
                    ...currentTask.hooks
                };
                stackHooks = stackHooks ? stackHooks.concat(hooks) : [hooks];
            }
            this.tasks.push({
                data: currentTask.data,
                node: currentTask.node,
                fullPaths: {
                    explicit: sourceTask.fullPaths.explicit.concat(partPaths.explicit),
                    implicit: sourceTask.fullPaths.implicit.concat(partPaths.implicit)
                },
                stackHooks
            });
        }
    }
    runHooks(currentTask, reject) {
        const stackHooks = currentTask.stackHooks;
        if (!stackHooks)
            return (null);
        const lastHooks = stackHooks[stackHooks.length - 1];
        if (!reject && lastHooks.index.branch !== this.tasks.length) {
            return (null);
        }
        for (let i = stackHooks.length - 1; i >= 0; i--) {
            const hooks = stackHooks[i];
            const claim = reject ? hooks.onReject(reject) : hooks.onAccept();
            switch (claim.action) {
                case "DEFAULT":
                    this.tasks.length = hooks.index.branch;
                    if (!reject)
                        return (null);
                    continue;
                case "REJECT":
                    this.tasks.length = hooks.index.branch;
                    reject = makeReject(hooks.owner, claim.code);
                    continue;
                case "IGNORE":
                    if ((claim === null || claim === void 0 ? void 0 : claim.target) === "CHUNK") {
                        this.tasks.length = hooks.index.chunk;
                    }
                    else {
                        this.tasks.length = hooks.index.branch;
                    }
                    return (null);
            }
        }
        return (reject);
    }
}
exports.CheckingStack = CheckingStack;
function checker(managers, rootNode, rootData) {
    const { formats, events } = managers;
    const stack = new CheckingStack(rootNode, rootData);
    let reject = null;
    while (stack.tasks.length) {
        const currentTask = stack.tasks.pop();
        const { data, node, stackHooks } = currentTask;
        const chunk = [];
        let code = null;
        if (data === null) {
            if (!node.nullable)
                code = "TYPE_NULL";
        }
        else if (data === undefined) {
            if (!node.undefinable)
                code = "TYPE_UNDEFINED";
        }
        else {
            const format = formats.get(node.type);
            code = format.check(chunk, node, data);
        }
        if (code)
            reject = makeReject(currentTask, code);
        else if (chunk.length)
            stack.addChunk(currentTask, chunk);
        if (stackHooks)
            reject = stack.runHooks(currentTask, reject);
        if (reject)
            break;
    }
    events.emit("DATA_CHECKED", rootNode, rootData, reject);
    return (reject);
}
;
