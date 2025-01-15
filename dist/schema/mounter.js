"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mounter = mounter;
const formats_1 = require("../formats");
const utils_1 = require("../utils");
function processTask(task) {
    var _a;
    const format = formats_1.formats[task.definedCriteria.type];
    if (!format)
        throw new utils_1.LibraryError("Criteria mounting", "Format type '" + task.definedCriteria.type + "' is unknown");
    format.mountCriteria(task.definedCriteria, task.mountedCriteria);
    const mountingTasks = (_a = format.getMountingTasks) === null || _a === void 0 ? void 0 : _a.call(format, task.definedCriteria, task.mountedCriteria);
    return ({
        mountingTasks
    });
}
function mounter(definedCriteria) {
    let mountedCriteria = {};
    let queue = [{ definedCriteria, mountedCriteria }];
    while (queue.length > 0) {
        const currentTask = queue.pop();
        const { mountingTasks } = processTask(currentTask);
        if (mountingTasks)
            Array.prototype.push.apply(queue, mountingTasks);
    }
    return (mountedCriteria);
}
;
