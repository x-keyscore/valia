"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checker = checker;
const formats_1 = require("./formats");
const Mapper_1 = require("./Mapper");
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
function reject(mapper, criteria, rejectCode) {
    return ({
        code: rejectCode,
        path: mapper.getPath(criteria, "."),
        type: criteria.type,
        label: criteria.label,
        message: criteria.message
    });
}
function checker(criteria, value) {
    const mapper = criteria[Mapper_1.mapperSymbol];
    let queue = [{ criteria, value }];
    while (queue.length > 0) {
        const { criteria, value, link } = queue.pop();
        if (link === null || link === void 0 ? void 0 : link.finished)
            continue;
        if (value === null) {
            if (criteria.nullable)
                continue;
            return (reject(mapper, criteria, "TYPE_NULL"));
        }
        else if (value === undefined) {
            if (criteria.undefinable)
                continue;
            return (reject(mapper, criteria, "TYPE_UNDEFINED"));
        }
        const format = formats_1.formats[criteria.type];
        const rejectCode = format.checking(queue, criteria, value);
        const rejectBypass = manageTaskLink(link, !!rejectCode);
        if (!rejectBypass && rejectCode) {
            return (reject(mapper, criteria, rejectCode));
        }
    }
    return (null);
}
;
