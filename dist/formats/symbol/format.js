"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SymbolFormat = void 0;
const testers_1 = require("../../testers");
exports.SymbolFormat = {
    defaultCriteria: {},
    checking(queue, criteria, value) {
        if (!(0, testers_1.isSymbol)(value)) {
            return "TYPE_NOT_SYMBOL";
        }
        else if (criteria.symbol !== undefined && criteria.symbol === value) {
            return "VALUE_INVALID_SYMBOL";
        }
        return (null);
    }
};
