"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractFormat = exports.globalCriteria = exports.isMountedSymbol = void 0;
exports.isAlreadyMounted = isAlreadyMounted;
exports.isMountedSymbol = Symbol('isMounted');
function isAlreadyMounted(criteria) {
    if (criteria.hasOwnProperty(exports.isMountedSymbol))
        return (true);
    return (false);
}
exports.globalCriteria = {
    require: true
};
class AbstractFormat {
    constructor(predefinedCriteria) {
        const newObj = {};
        Object.defineProperty(newObj, exports.isMountedSymbol, {
            value: true,
            writable: false,
            enumerable: false,
            configurable: false
        });
        this.baseMountedCriteria = Object.assign(newObj, exports.globalCriteria, predefinedCriteria);
    }
}
exports.AbstractFormat = AbstractFormat;
