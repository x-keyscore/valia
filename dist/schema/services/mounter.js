"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadataSymbol = void 0;
exports.isMountedCriteria = isMountedCriteria;
exports.mounter = mounter;
const formats_1 = require("../formats");
const utils_1 = require("../../utils");
exports.metadataSymbol = Symbol('matadata');
function isMountedCriteria(obj) {
    return (typeof obj === "object" && Reflect.has(obj, exports.metadataSymbol));
}
function mounter(managers, criteria) {
    var _a;
    const registryManager = managers.registry;
    const eventsManager = managers.events;
    let queue = [{
            prevNode: null,
            prevPath: { explicit: [], implicit: [] },
            currNode: criteria,
            partPath: { explicit: [], implicit: [] },
        }];
    while (queue.length > 0) {
        const { prevNode, prevPath, currNode, partPath } = queue.pop();
        const path = {
            explicit: [...prevPath.explicit, ...partPath.explicit],
            implicit: [...prevPath.implicit, ...partPath.implicit],
        };
        registryManager.set(prevNode, currNode, partPath);
        if (isMountedCriteria(currNode)) {
            registryManager.junction(currNode);
        }
        else {
            const format = formats_1.formats[currNode.type];
            if (!format)
                throw new utils_1.Issue("Mounting", "Type '" + currNode.type + "' is unknown.");
            (_a = format.mounting) === null || _a === void 0 ? void 0 : _a.call(format, queue, path, currNode);
            Object.assign(currNode, {
                ...formats_1.staticDefaultCriteria,
                ...format.defaultCriteria,
                ...currNode
            });
        }
        Object.assign(currNode, {
            [exports.metadataSymbol]: {
                registry: registryManager.registry,
                saveNode: currNode
            }
        });
        eventsManager.emit("NODE_MOUNTED", currNode, path);
    }
    eventsManager.emit("FULL_MOUNTED");
    return criteria;
}
;
