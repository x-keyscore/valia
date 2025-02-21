"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checker = checker;
const formats_1 = require("../formats");
const utils_1 = require("../../utils");
function reject(rejectCode, criteria, path) {
    return ({
        path,
        code: rejectCode,
        type: criteria.type,
        label: criteria.label,
        message: criteria.message
    });
}
function checker(registryManager, criteria, value) {
    let queue = [{
            prevPath: { explicit: [], implicit: [] },
            criteria,
            value
        }];
    while (queue.length > 0) {
        const { prevPath, criteria, value, hooks } = queue.pop();
        const segsPath = registryManager.getPathSegments(criteria);
        const path = {
            explicit: [...prevPath.explicit, ...segsPath.explicit],
            implicit: [...prevPath.implicit, ...segsPath.implicit],
        };
        if (hooks) {
            const hookResponse = hooks.beforeCheck(criteria);
            if (hookResponse === false)
                continue;
            if (typeof hookResponse === "string") {
                return (reject(hookResponse, hooks.owner.criteria, hooks.owner.path));
            }
        }
        let rejectCode = null;
        if (value === null) {
            if (criteria.nullable)
                rejectCode = null;
            else
                rejectCode = "TYPE_NULL";
        }
        else if (value === undefined) {
            if (criteria.undefinable)
                rejectCode = null;
            else
                rejectCode = "TYPE_UNDEFINED";
        }
        else {
            const format = formats_1.formats[criteria.type];
            if (!format)
                throw new utils_1.Issue("Checking", "Type '" + criteria.type + "' is unknown.");
            rejectCode = format.checking(queue, path, criteria, value);
        }
        if (hooks) {
            const hookResponse = hooks.afterCheck(criteria, rejectCode);
            if (hookResponse === false)
                continue;
            if (typeof hookResponse === "string") {
                return (reject(hookResponse, hooks.owner.criteria, hooks.owner.path));
            }
        }
        if (rejectCode) {
            return (reject(rejectCode, criteria, path));
        }
    }
    return (null);
}
;
