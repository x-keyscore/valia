"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnionFormat = void 0;
exports.UnionFormat = {
    defaultCriteria: {
        empty: false
    },
    mount(chunk, criteria) {
        for (let i = 0; i < criteria.union.length; i++) {
            chunk.push({
                node: criteria.union[i],
                partPaths: {
                    explicit: ["union", i],
                    implicit: []
                }
            });
        }
    },
    check(chunk, criteria, data) {
        const unionLength = criteria.union.length;
        const ctx = {
            totalRejected: 0,
            totalHooked: unionLength,
        };
        for (let i = 0; i < unionLength; i++) {
            chunk.push({
                data,
                node: criteria.union[i],
                hooks: {
                    onAccept() {
                        return ({
                            action: "RESET",
                            before: "CHUNK"
                        });
                    },
                    onReject() {
                        ctx.totalRejected++;
                        if (ctx.totalRejected === ctx.totalHooked) {
                            return ({
                                action: "REJECT",
                                code: "VALUE_UNSATISFIED_UNION"
                            });
                        }
                        return ({
                            action: "IGNORE"
                        });
                    }
                }
            });
        }
        return (null);
    }
};
/*
const hooks: CheckingTaskHooks<HooksCustomProperties> = {
    owner: { node: criteria, path },
    totalRejected: 0,
    totalHooked: unionLength,
    isFinished: false,
    beforeCheck(criteria) {
        if(this.isFinished) return (false);
        return (true);
    },
    afterCheck(criteria, reject) {
        if (reject) this.totalRejected++;

        if (this.totalRejected === this.totalHooked) {
            this.isFinished = true;
            return ("VALUE_UNSATISFIED_UNION");
        } else if (reject) {
            return (false);
        } else {
            return (true);
        }
    }
};*/
