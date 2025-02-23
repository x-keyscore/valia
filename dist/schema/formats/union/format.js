"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnionFormat = void 0;
exports.UnionFormat = {
    defaultCriteria: {
        empty: false
    },
    mounting(queue, path, criteria) {
        for (let i = 0; i < criteria.union.length; i++) {
            queue.push({
                prevNode: criteria,
                prevPath: path,
                currNode: criteria.union[i],
                partPath: {
                    explicit: ["union", i],
                    implicit: []
                }
            });
        }
    },
    checking(queue, path, criteria, value) {
        const unionLength = criteria.union.length;
        const hooks = {
            owner: { node: criteria, path },
            totalRejected: 0,
            totalHooked: unionLength,
            isFinished: false,
            beforeCheck(criteria) {
                if (this.isFinished)
                    return (false);
                return (true);
            },
            afterCheck(criteria, reject) {
                if (reject)
                    this.totalRejected++;
                if (this.totalRejected === this.totalHooked) {
                    this.isFinished = true;
                    return ("VALUE_UNSATISFIED_UNION");
                }
                else if (reject) {
                    return (false);
                }
                else {
                    return (true);
                }
            }
        };
        for (let i = 0; i < unionLength; i++) {
            queue.push({
                prevPath: path,
                currNode: criteria.union[i],
                value,
                hooks
            });
        }
        return (null);
    }
};
