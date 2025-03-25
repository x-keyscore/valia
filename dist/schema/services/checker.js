"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckingChunk = void 0;
exports.checker = checker;
const mounter_1 = require("./mounter");
function reject(code, node, path) {
    return ({
        code,
        path,
        type: node.type,
        label: node.label,
        message: node.message
    });
}
class CheckingChunk extends Array {
    constructor(queue, owner) {
        super();
        this.queue = queue;
        this.owner = owner;
    }
    addTask(task) {
        const partPaths = task.node[mounter_1.nodeSymbol].partPaths;
        let branchHooks = this.owner.branchHooks;
        if (task.hooks && Object.keys(task.hooks)) {
            const hooks = {
                owner: this.owner,
                callbacks: task.hooks,
                awaitTasks: 0,
                resetIndex: this.queue.length - 1
            };
            branchHooks = branchHooks ? branchHooks.concat(hooks) : [hooks];
        }
        this.push({
            data: task.data,
            node: task.node,
            fullPaths: {
                explicit: this.owner.fullPaths.explicit.concat(partPaths.explicit),
                implicit: this.owner.fullPaths.implicit.concat(partPaths.implicit)
            },
            branchHooks
        });
    }
}
exports.CheckingChunk = CheckingChunk;
function checker(managers, rootNode, rootData) {
    const formats = managers.formats;
    const events = managers.events;
    const queue = [{
            data: rootData,
            node: rootNode,
            fullPaths: { explicit: [], implicit: [] }
        }];
    while (queue.length) {
        const task = queue.pop();
        const chunk = new CheckingChunk(queue, task);
        const { data, node, fullPaths, branchHooks } = task;
        //console.log(fullPaths.explicit.join("."));
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
        if (code) {
            return (reject(code, node, fullPaths));
        }
        if (chunk.length) {
            queue.push(...chunk);
        }
    }
    events.emit("TREE_CHECKED", rootNode, null);
    return (null);
}
;
/*
if (hooks) {
    const response = hooks.beforeCheck(currNode);
    if (response === false) continue;
    if (typeof response === "string") {
        return(rejection(
            events,
            response,
            hooks.owner.node,
            hooks.owner.path
        ));
    }
}*/
/*
if (hooks) {
    const response = hooks.afterCheck(currNode, code);
    if (response === false) continue;
    if (typeof response === "string") {
        return(rejection(
            events,
            response,
            hooks.owner.node,
            hooks.owner.path
        ));
    }
}*/ 
