"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloner = cloner;
const testers_1 = require("../testers");
const mounter_1 = require("./mounter");
function processTask(queue, { src, cpy }) {
    if ((0, testers_1.isPlainObject)(src)) {
        if ((0, mounter_1.isMountedCriteria)(src)) {
            cpy = src;
        }
        else {
            const keys = Reflect.ownKeys(src);
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                if ((0, testers_1.isPlainObject)(src[key])) {
                    if ((0, mounter_1.isMountedCriteria)(src[key])) {
                        cpy[key] = src[key];
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
            if ((0, testers_1.isPlainObject)(src[i])) {
                if ((0, mounter_1.isMountedCriteria)(src[i])) {
                    cpy[i] = src[i];
                }
                else {
                    cpy[i] = {};
                    queue.push({
                        src: src[i],
                        cpy: cpy[i]
                    });
                }
            }
            else if ((0, testers_1.isArray)(src[i])) {
                cpy[i] = [];
                queue.push({
                    src: src[i],
                    cpy: cpy[i]
                });
            }
            else {
                cpy[i] = src[i];
            }
        }
    }
    else {
        cpy = src;
    }
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
        processTask(queue, currentTask);
    }
    return cpy;
}
;
