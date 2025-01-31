"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checker = checker;
const formats_1 = require("./formats");
const Registry_1 = require("./Registry");
function manageTaskLink(link, isReject) {
    if (link) {
        if (!isReject) {
            link.finished = true;
        }
        else {
            link.totalRejected++;
            if (link.totalLinks !== link.totalRejected)
                return (true);
        }
    }
    return (false);
}
function reject(registry, criteria, rejectState) {
    return ({
        code: "REJECT_" + rejectState,
        path: registry.getPath(criteria, "."),
        type: criteria.type,
        label: criteria.label,
        message: criteria.message
    });
}
function checker(criteria, value) {
    const registry = criteria[Registry_1.registrySymbol];
    let queue = [{ criteria, value }];
    while (queue.length > 0) {
        const { criteria, value, link } = queue.pop();
        if (link === null || link === void 0 ? void 0 : link.finished)
            continue;
        if (value === null) {
            if (criteria.nullable)
                continue;
            return (reject(registry, criteria, "TYPE_NULL"));
        }
        else if (value === undefined) {
            if (criteria.optional)
                continue;
            return (reject(registry, criteria, "TYPE_UNDEFINED"));
        }
        const format = formats_1.formats[criteria.type];
        const rejectState = format.checking(queue, criteria, value);
        const rejectBypass = manageTaskLink(link, !!rejectState);
        if (!rejectBypass && rejectState) {
            return (reject(registry, criteria, rejectState));
        }
    }
    return (null);
}
;
