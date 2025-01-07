"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemaChecker = schemaChecker;
const formats_1 = require("../formats");
function processTask(task) {
    const format = formats_1.formatsInstances[task.mountedCriteria.type];
    const checkResult = format.checkValue(task.mountedCriteria, task.value);
    const checkTasks = format.getCheckingTasks(task.mountedCriteria, task.value);
    return ({ checkResult, checkTasks });
}
function schemaChecker(mountedCriteria, value) {
    let queue = [{ mountedCriteria, value }];
    while (queue.length > 0) {
        const currentTask = queue.pop();
        const { checkResult, checkTasks } = processTask(currentTask);
        if (checkResult.error) {
            return ({
                error: {
                    code: checkResult.error.code,
                    label: currentTask.mountedCriteria.label
                }
            });
        }
        queue.push(...checkTasks);
    }
    return ({
        error: null
    });
}
;
