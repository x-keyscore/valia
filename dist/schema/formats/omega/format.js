"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmegaFormat = void 0;
exports.OmegaFormat = {
    defaultCriteria: {},
    mount(chunk, criteria) {
        const bitmap = {
            "undefined": 1 << 0,
            "unknown": 1 << 1,
            "nullish": 1 << 2,
            "null": 1 << 3,
            "any": 1 << 4
        };
        Object.assign(criteria, {
            bitcode: bitmap[criteria.omega]
        });
    },
    check(chunk, criteria, value) {
        const { bitcode } = criteria;
        if (bitcode & ((1 << 1) | (1 << 4))) {
            return (null);
        }
        if (value === null) {
            if (!(bitcode & ((1 << 3) | (1 << 2)))) {
                return ("TYPE_NULL_DISALLOWED");
            }
        }
        else if (value === undefined) {
            if (!(bitcode & ((1 << 0) | (1 << 2)))) {
                return ("TYPE_UNDEFINED_DISALLOWED");
            }
        }
        return (null);
    }
};
