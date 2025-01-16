"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloner = cloner;
const formats_1 = require("../formats/formats");
const testers_1 = require("../testers");
function processTask(task) {
    let cloningTasks = [];
    if ((0, testers_1.isPlainObject)(task.src)) {
        if ((0, formats_1.isMountedCriteria)(task.src)) {
            task.cpy = task.src;
        }
        else {
            Object.assign(task.cpy, task.src);
            const keys = Object.keys(task.src);
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                if ((0, testers_1.isPlainObject)(task.src[key]) && (0, formats_1.isMountedCriteria)(task.src)) {
                    Reflect.set(task.cpy, key, {});
                }
                cloningTasks.push({
                    src: task.src[key],
                    cpy: task.cpy[key]
                });
            }
        }
    }
    else if ((0, testers_1.isArray)(task.src)) {
        task.cpy = Object.assign([], task.src);
        for (let i = 0; i < task.src.length; i++) {
            if ((0, testers_1.isPlainObject)(task.src[i]) && (0, formats_1.isMountedCriteria)(task.src)) {
                Reflect.set(task.cpy, i, {});
            }
            cloningTasks.push({
                src: task.src[i],
                cpy: task.cpy[i]
            });
        }
    }
    else {
        task.cpy = task.src;
    }
    return ({
        cloningTasks
    });
}
/**
 * Clones the object starting from the root and stops traversing a branch
 * when the `mountedMarker` symbol is encountered. In such cases, the object
 * containing the symbol is directly assigned to the corresponding node.
 *
 * @param src Source object of the clone
 * @returns Clone of the source object
 */
function cloner(src) {
    let cpy = {};
    let queue = [{ src, cpy }];
    while (queue.length > 0) {
        const currentTask = queue.pop();
        const { cloningTasks } = processTask(currentTask);
        if (cloningTasks)
            Array.prototype.push.apply(queue, cloningTasks);
    }
    return cpy;
}
;
