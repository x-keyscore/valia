"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SymbolFormat = void 0;
exports.SymbolFormat = {
    defaultCriteria: {},
    checking(queue, path, criteria, value) {
        if (typeof value !== "symbol") {
            return "TYPE_NOT_SYMBOL";
        }
        else if (criteria.symbol !== undefined && criteria.symbol !== value) {
            return "VALUE_INVALID_SYMBOL";
        }
        return (null);
    }
};
