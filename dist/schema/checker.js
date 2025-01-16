"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checker = checker;
const formats_1 = require("../formats");
function manageTaskLink(link, isReject) {
    if (link) {
        if (!isReject) {
            link.isClose = true;
        }
        else if (link.totalLinks !== link.totalRejected) {
            return (true);
        }
    }
    return (false);
}
function basicCheckValue(task) {
    if (!task.criteria.nullable && task.value === null) {
        return ("TYPE_NULL");
    }
    else if (!task.criteria.optional && task.value === undefined) {
        return ("TYPE_UNDEFINED");
    }
    return (null);
}
function processTask(task) {
    var _a;
    const { criteria, link } = task;
    const format = formats_1.formats[criteria.type];
    if (link === null || link === void 0 ? void 0 : link.isClose)
        return ({
            skipTask: true
        });
    const rejectState = basicCheckValue(task) || format.checkValue(criteria, task.value);
    const rejectBypass = manageTaskLink(link, !!rejectState);
    if (rejectState) {
        return ({
            rejectBypass,
            rejectState
        });
    }
    const checkingTasks = (_a = format.getCheckingTasks) === null || _a === void 0 ? void 0 : _a.call(format, criteria, task.value);
    return ({
        rejectBypass: false,
        rejectState,
        checkingTasks
    });
}
function checker(criteria, value) {
    let queue = [{ criteria, value }];
    while (queue.length > 0) {
        const currentTask = queue.pop();
        const { rejectBypass, rejectState, checkingTasks } = processTask(currentTask);
        if (rejectBypass) {
            continue;
        }
        else if (rejectState) {
            const { criteria } = currentTask;
            return ({
                code: "REJECT_" + rejectState,
                type: criteria.type,
                label: criteria.label,
                message: criteria.message
            });
        }
        if (checkingTasks)
            Array.prototype.push.apply(queue, checkingTasks);
    }
    return (null);
}
;
