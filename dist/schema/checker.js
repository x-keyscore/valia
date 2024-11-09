"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemaChecker = schemaChecker;
function checkFormat(task) {
    return (task.node.format.checker(task.value));
}
function extractTasks(task) {
    const { node: { branchType, branch }, value, depth } = task;
    const queue = [];
    if (!value || !branch)
        return (queue);
    let newDepth = depth + 1;
    if (branchType === "entry") {
        for (const key in value) {
            queue.push({
                node: branch[key],
                value: value[key],
                depth: newDepth
            });
        }
    }
    else if (branchType === "array") {
        for (const item of value) {
            queue.push({
                node: branch[0],
                value: item,
                depth: newDepth
            });
        }
    }
    else {
        throw new Error("'next' could not be processed, because it does not meet the expected type.");
    }
    return (queue);
}
function schemaChecker(input, node) {
    let queue = [{ node, value: input, depth: 0 }];
    while (queue.length > 0) {
        const currentTask = queue.pop();
        const checkResult = checkFormat(currentTask);
        if (checkResult.error) {
            return ({
                error: {
                    depth: currentTask.depth,
                    code: checkResult.error?.code || "UNKNOWN",
                    label: currentTask.node.format.criteria.label || undefined
                }
            });
        }
        const tasks = extractTasks(currentTask);
        if (tasks.length) {
            queue.push(...tasks);
        }
    }
    return ({
        error: null
    });
}
;
