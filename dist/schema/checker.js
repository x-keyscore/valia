"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checker = checker;
const formats_1 = require("../formats");
const mounter_1 = require("./mounter");
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
function basicChecking(criteria, value) {
    if (!criteria.nullable && value === null) {
        return ("TYPE_NULL");
    }
    else if (!criteria.optional && value === undefined) {
        return ("TYPE_UNDEFINED");
    }
    return (null);
}
function checker(criteria, value) {
    const register = criteria[mounter_1.metadataSymbol].register;
    let queue = [{ criteria, value }];
    while (queue.length > 0) {
        const { criteria, value, link } = queue.pop();
        if (link === null || link === void 0 ? void 0 : link.finished)
            continue;
        const format = formats_1.formats[criteria.type];
        const rejectState = basicChecking(criteria, value) || format.checking(queue, criteria, value);
        const rejectBypass = manageTaskLink(link, !!rejectState);
        if (!rejectBypass && rejectState) {
            return ({
                code: "REJECT_" + rejectState,
                path: register.getPath(criteria, "."),
                type: criteria.type,
                label: criteria.label,
                message: criteria.message
            });
        }
    }
    return (null);
}
;
