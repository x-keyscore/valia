"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckingChunk = void 0;
exports.checker = checker;
const mounter_1 = require("./mounter");
function reject(code, node, path) {
    return ({
        path,
        code: code,
        type: node.type,
        label: node.label,
        message: node.message
    });
}
class CheckingChunk extends Array {
    constructor(paths) {
        super();
        this.paths = paths;
    }
    addTask(task) {
        const partPaths = task.node[mounter_1.nodeSymbol].partPaths;
        this.push({
            data: task.data,
            node: task.node,
            fullPaths: {
                explicit: [...this.paths.explicit, ...partPaths.explicit],
                implicit: [...this.paths.implicit, ...partPaths.implicit]
            }
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
    while (queue.length > 0) {
        const { data, node, fullPaths } = queue.pop();
        const chunk = new CheckingChunk(fullPaths);
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
        queue.push(...chunk);
        events.emit('ONE_NODE_CHECKED', node, fullPaths);
    }
    events.emit("END_OF_CHECKING", rootNode, null);
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
