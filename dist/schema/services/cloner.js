"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloner = cloner;
const testers_1 = require("../../testers");
const mounter_1 = require("./mounter");
function processTask(queue, { src, cpy }) {
    if ((0, testers_1.isBasicObject)(src)) {
        if ((0, mounter_1.isMountedCriteria)(src)) {
            cpy = { ...src };
        }
        else {
            const keys = Reflect.ownKeys(src);
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                if ((0, testers_1.isBasicObject)(src[key])) {
                    if ((0, mounter_1.isMountedCriteria)(src[key])) {
                        cpy[key] = { ...src[key] };
                    }
                    else {
                        cpy[key] = {};
                        queue.push({
                            src: src[key],
                            cpy: cpy[key]
                        });
                    }
                }
                else if ((0, testers_1.isArray)(src[key])) {
                    cpy[key] = [];
                    queue.push({
                        src: src[key],
                        cpy: cpy[key]
                    });
                }
                else {
                    cpy[key] = src[key];
                }
            }
        }
    }
    else if ((0, testers_1.isArray)(src)) {
        for (let i = 0; i < src.length; i++) {
            const index = i;
            if ((0, testers_1.isBasicObject)(src[index])) {
                if ((0, mounter_1.isMountedCriteria)(src[index])) {
                    cpy[i] = { ...src[index] };
                }
                else {
                    cpy[i] = {};
                    queue.push({
                        src: src[index],
                        cpy: cpy[index]
                    });
                }
            }
            else if ((0, testers_1.isArray)(src[index])) {
                cpy[index] = [];
                queue.push({
                    src: src[index],
                    cpy: cpy[index]
                });
            }
            else {
                cpy[index] = src[index];
            }
        }
    }
    else {
        cpy = src;
    }
}
/**
 * Clones the object starting from the root and stops traversing a branch
 * when a mounted criteria node is encountered. In such cases, the mounted
 * object encountered see its internal properties copied to a new reference
 * so that the junction is a unique reference in the tree.
 *
 * @param src Source object of the clone
 * @returns Clone of the source object
 */
function cloner(src) {
    let cpy = {};
    let queue = [{ src, cpy }];
    while (queue.length > 0) {
        const currentTask = queue.pop();
        processTask(queue, currentTask);
    }
    return cpy;
}
;
