"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SymbolFormat = void 0;
exports.SymbolFormat = {
    defaultCriteria: {},
    check(queue, criteria, data) {
        if (typeof data !== "symbol") {
            return "TYPE_SYMBOL_REQUIRED";
        }
        else if (criteria.symbol !== undefined && data !== criteria.symbol) {
            return "DATA_SYMBOL_MISMATCH";
        }
        return (null);
    }
};
