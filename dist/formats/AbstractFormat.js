"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractFormat = exports.isMountedSymbol = void 0;
exports.isAlreadyMounted = isAlreadyMounted;
exports.isMountedSymbol = Symbol('isMounted');
function isAlreadyMounted(criteria) {
    return (Object.prototype.hasOwnProperty(exports.isMountedSymbol));
}
class AbstractFormat {
    constructor(defaultCriteria) {
        this.baseMountedCriteria = Object.assign({
            [exports.isMountedSymbol]: true,
            optional: false,
            nullable: false
        }, defaultCriteria);
    }
}
exports.AbstractFormat = AbstractFormat;
