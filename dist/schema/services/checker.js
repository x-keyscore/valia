"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checker = checker;
const formats_1 = require("../formats");
const utils_1 = require("../../utils");
function reject(eventsManager, code, node, path) {
    const obj = {
        path,
        code: code,
        type: node.type,
        label: node.label,
        message: node.message
    };
    eventsManager.emit('NODE_CHECKED', node, path, obj);
    return (obj);
}
function checker(managers, criteria, value) {
    const registryManager = managers.registry;
    const eventsManager = managers.events;
    let queue = [{
            prevPath: { explicit: [], implicit: [] },
            currNode: criteria,
            value
        }];
    while (queue.length > 0) {
        const { prevPath, currNode, value, hooks } = queue.pop();
        const partPath = registryManager.getPartPaths(currNode);
        const path = {
            explicit: [...prevPath.explicit, ...partPath.explicit],
            implicit: [...prevPath.implicit, ...partPath.implicit],
        };
        if (hooks) {
            const response = hooks.beforeCheck(currNode);
            if (response === false)
                continue;
            if (typeof response === "string") {
                return (reject(eventsManager, response, hooks.owner.node, hooks.owner.path));
            }
        }
        let state = null;
        if (value === null) {
            if (currNode.nullable)
                state = null;
            else
                state = "TYPE_NULL";
        }
        else if (value === undefined) {
            if (currNode.undefinable)
                state = null;
            else
                state = "TYPE_UNDEFINED";
        }
        else {
            const format = formats_1.formats[currNode.type];
            if (!format)
                throw new utils_1.Issue("Checking", "Type '" + currNode.type + "' is unknown.");
            state = format.checking(queue, path, currNode, value);
        }
        if (hooks) {
            const response = hooks.afterCheck(currNode, state);
            if (response === false)
                continue;
            if (typeof response === "string") {
                return (reject(eventsManager, response, hooks.owner.node, hooks.owner.path));
            }
        }
        if (state) {
            return (reject(eventsManager, state, currNode, path));
        }
        eventsManager.emit('NODE_CHECKED', currNode, path, null);
    }
    return (null);
}
;
