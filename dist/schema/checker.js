"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemaChecker = schemaChecker;
const formats_1 = require("../formats");
function processTask(task) {
    const format = formats_1.formatsInstances[task.criteria.type];
    const rejectCode = format.checkEntry(task.criteria, task.entry);
    const checkingTasks = format.getCheckingTasks(task.criteria, task.entry);
    return ({
        rejectCode,
        checkingTasks
    });
}
function schemaChecker(criteria, entry) {
    let queue = [{ criteria, entry }];
    while (queue.length > 0) {
        const currentTask = queue.pop();
        const { rejectCode, checkingTasks } = processTask(currentTask);
        if (rejectCode) {
            return ({
                code: rejectCode,
                type: currentTask.criteria.type,
                label: currentTask.criteria.label,
                message: currentTask.criteria.message
            });
        }
        queue.push(...checkingTasks);
    }
    return (null);
}
;
