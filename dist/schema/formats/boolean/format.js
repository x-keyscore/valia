"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooleanFormat = void 0;
exports.BooleanFormat = {
    defaultCriteria: {},
    checking(queue, criteria, value) {
        if (typeof value !== "boolean") {
            return ("TYPE_NOT_BOOLEAN");
        }
        return (null);
    },
};
