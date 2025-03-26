"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MountingQueue = exports.nodeSymbol = void 0;
exports.hasNodeSymbol = hasNodeSymbol;
exports.mounter = mounter;
const formats_1 = require("../formats");
exports.nodeSymbol = Symbol('internal');
function hasNodeSymbol(obj) {
    return (typeof obj === "object" && Reflect.has(obj, exports.nodeSymbol));
}
class MountingQueue extends Array {
    constructor(rootNode) {
        super();
        this.push({
            node: rootNode,
            partPaths: { explicit: [], implicit: [] },
            fullPaths: { explicit: [], implicit: [] }
        });
    }
    pushChunk(owner, chunk) {
        for (let i = 0; i < chunk.length; i++) {
            const task = chunk[i];
            this.push({
                node: task.node,
                partPaths: task.partPaths,
                fullPaths: {
                    explicit: owner.fullPaths.explicit.concat(task.partPaths.explicit),
                    implicit: owner.fullPaths.implicit.concat(task.partPaths.implicit)
                }
            });
        }
    }
}
exports.MountingQueue = MountingQueue;
function mounter(managers, rootNode) {
    var _a;
    const formats = managers.formats;
    const events = managers.events;
    const queue = new MountingQueue(rootNode);
    while (queue.length) {
        const task = queue.pop();
        const { node, partPaths, fullPaths } = task;
        if (hasNodeSymbol(node)) {
            node[exports.nodeSymbol] = {
                ...node[exports.nodeSymbol],
                partPaths
            };
        }
        else {
            const format = formats.get(node.type);
            const chunk = [];
            (_a = format.mount) === null || _a === void 0 ? void 0 : _a.call(format, chunk, node);
            Object.assign(node, {
                ...formats_1.staticDefaultCriteria,
                ...format.defaultCriteria,
                ...node,
                [exports.nodeSymbol]: {
                    partPaths,
                    childNodes: chunk.map((task) => task.node)
                }
            });
            Object.freeze(node);
            if (chunk.length) {
                queue.pushChunk(task, chunk);
            }
            events.emit("NODE_MOUNTED", node, fullPaths);
        }
    }
    events.emit("TREE_MOUNTED", rootNode);
    return rootNode;
}
;
