"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooleanFormat = void 0;
exports.BooleanFormat = {
    defaultCriteria: {},
    check(chunk, criteria, data) {
        if (typeof data !== "boolean") {
            return ("TYPE_NOT_BOOLEAN");
        }
        return (null);
    },
};
