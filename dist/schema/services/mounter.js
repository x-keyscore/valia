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
function mounter(registryManager, eventsManager, clonedCriteria) {
    var _a;
    let queue = [{
            prevCriteria: null,
            prevPath: { explicit: [], implicit: [] },
            criteria: clonedCriteria,
            pathSegments: { explicit: [], implicit: [] }
        }];
    while (queue.length > 0) {
        const { prevCriteria, prevPath, criteria, pathSegments } = queue.pop();
        const path = {
            explicit: [...prevPath.explicit, ...pathSegments.explicit],
            implicit: [...prevPath.implicit, ...pathSegments.implicit],
        };
        registryManager.set(prevCriteria, criteria, pathSegments);
        if (isMountedCriteria(criteria)) {
            registryManager.junction(criteria);
        }
        else {
            const format = formats_1.formats[criteria.type];
            if (!format)
                throw new utils_1.Issue("Mounting", "Type '" + criteria.type + "' is unknown.");
            (_a = format.mounting) === null || _a === void 0 ? void 0 : _a.call(format, queue, path, criteria);
            Object.assign(criteria, {
                ...formats_1.staticDefaultCriteria,
                ...format.defaultCriteria,
                ...criteria
            });
        }
        Object.assign(criteria, {
            [exports.metadataSymbol]: {
                registryKey: criteria,
                registry: registryManager.registry
            }
        });
        eventsManager.emit("CRITERIA_NODE_MOUNTED", criteria, path);
    }
    return clonedCriteria;
}
;
