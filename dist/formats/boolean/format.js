"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooleanFormat = void 0;
const testers_1 = require("../../testers");
exports.BooleanFormat = {
    defaultCriteria: {},
    checking(queue, criteria, value) {
        if (!(0, testers_1.isBoolean)(value)) {
            return ("TYPE_NOT_BOOLEAN");
        }
        return (null);
    },
};
