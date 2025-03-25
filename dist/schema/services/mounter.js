"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MountingChunk = exports.nodeSymbol = void 0;
exports.hasNodeSymbol = hasNodeSymbol;
exports.mounter = mounter;
const formats_1 = require("../formats");
exports.nodeSymbol = Symbol('internal');
function hasNodeSymbol(obj) {
    return (typeof obj === "object" && Reflect.has(obj, exports.nodeSymbol));
}
class MountingChunk extends Array {
    constructor(paths) {
        super();
        this.paths = paths;
    }
    add(task) {
        this.push({
            node: task.node,
            partPaths: task.partPaths,
            fullPaths: {
                explicit: this.paths.explicit.concat(task.partPaths.explicit),
                implicit: this.paths.implicit.concat(task.partPaths.implicit)
            }
        });
    }
}
exports.MountingChunk = MountingChunk;
function mounter(managers, rootNode) {
    var _a;
    const formats = managers.formats;
    const events = managers.events;
    const queue = [{
            node: rootNode,
            partPaths: { explicit: [], implicit: [] },
            fullPaths: { explicit: [], implicit: [] }
        }];
    while (queue.length) {
        const { node, partPaths, fullPaths } = queue.pop();
        if (hasNodeSymbol(node)) {
            node[exports.nodeSymbol] = {
                partPaths,
                childNodes: node[exports.nodeSymbol].childNodes,
            };
        }
        else {
            const format = formats.get(node.type);
            const chunk = new MountingChunk(fullPaths);
            (_a = format.mount) === null || _a === void 0 ? void 0 : _a.call(format, chunk, node);
            Object.assign(node, {
                ...formats_1.staticDefaultCriteria,
                ...format.defaultCriteria,
                ...node,
                [exports.nodeSymbol]: {
                    partPaths,
                    childNodes: new Set(chunk.map((task) => task.node)),
                }
            });
            Object.freeze(node);
            if (chunk.length)
                queue.push(...chunk);
            events.emit("NODE_MOUNTED", node, fullPaths);
        }
    }
    events.emit("TREE_MOUNTED", rootNode);
    return rootNode;
}
;
