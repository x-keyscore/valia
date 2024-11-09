"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemaBuilder = schemaBuilder;
const formats_1 = require("../formats");
const utils_1 = require("./utils");
function assignFormatToNode(task) {
    const constructor = formats_1.formats[task.criteria.type];
    if (!constructor)
        throw new Error("Unknown format type");
    task.node.format = (0, utils_1.construct)(constructor, [task.criteria]);
}
function assignBranchToNode(task) {
    const { criteria, depth } = task;
    let ref;
    let queue = [];
    let subDepth = depth + 1;
    if (criteria.type === "record") {
        ref = {
            branchType: "entry",
            branch: {}
        };
        const record = criteria.record;
        const keys = Object.keys(record);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            ref.branch[key] = {};
            queue.push({
                criteria: record[key],
                node: ref.branch[key],
                depth: subDepth
            });
        }
    }
    else if (criteria.type === "array") {
        ref = {
            branchType: "array",
            branch: []
        };
        const array = criteria.array;
        for (let i = 0; i < array.length; i++) {
            ref.branch[i] = {};
            queue.push({
                criteria: array[i],
                node: ref.branch[i],
                depth: subDepth
            });
        }
    }
    else {
        ref = {
            branchType: "empty",
            branch: null
        };
    }
    task.node.branchType = ref.branchType;
    task.node.branch = ref.branch;
    return (queue);
}
function schemaBuilder(criteria) {
    let treeRoot = {};
    let queue = [{ criteria, node: treeRoot, depth: 0 }];
    while (queue.length > 0) {
        const currentTask = queue.pop();
        assignFormatToNode(currentTask);
        queue.push(...assignBranchToNode(currentTask));
    }
    console.log(treeRoot);
    return treeRoot;
}
