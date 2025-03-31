"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MountingStack = exports.nodeSymbol = void 0;
exports.hasNodeSymbol = hasNodeSymbol;
exports.mounter = mounter;
const formats_1 = require("../formats");
exports.nodeSymbol = Symbol('internal');
function hasNodeSymbol(obj) {
    return (typeof obj === "object" && Reflect.has(obj, exports.nodeSymbol));
}
class MountingStack extends Array {
    constructor(rootNode) {
        super();
        this.push({
            node: rootNode,
            partPaths: { explicit: [], implicit: [] },
            fullPaths: { explicit: [], implicit: [] }
        });
    }
    addChunk(owner, chunk) {
        const { fullPaths } = owner;
        for (let i = 0; i < chunk.length; i++) {
            const { node, partPaths } = chunk[i];
            this.push({
                node,
                partPaths,
                fullPaths: {
                    explicit: fullPaths.explicit.concat(partPaths.explicit),
                    implicit: fullPaths.implicit.concat(partPaths.implicit)
                }
            });
        }
    }
}
exports.MountingStack = MountingStack;
function mounter(managers, rootNode) {
    var _a;
    const { formats, events } = managers;
    const stack = new MountingStack(rootNode);
    while (stack.length) {
        const currentTask = stack.pop();
        const { node, partPaths, fullPaths } = currentTask;
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
                    childNodes: chunk.map((task) => task.node),
                    partPaths
                }
            });
            Object.freeze(node);
            if (chunk.length) {
                stack.addChunk(currentTask, chunk);
            }
            events.emit("NODE_MOUNTED", node, fullPaths);
        }
    }
    events.emit("TREE_MOUNTED", rootNode);
    return rootNode;
}
;
