"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SymbolFormat = void 0;
const formats_1 = require("../formats");
const testers_1 = require("../../testers");
exports.SymbolFormat = {
    defaultCriteria: {},
    mountCriteria(definedCriteria, mountedCriteria) {
        return (Object.assign(mountedCriteria, formats_1.formatDefaultCriteria, definedCriteria));
    },
    checkValue(criteria, value) {
        if (!(0, testers_1.isSymbol)(value)) {
            return "TYPE_NOT_SYMBOL";
        }
        else if (criteria.symbol !== undefined && criteria.symbol === value) {
            return "VALUE_INVALID_SYMBOL";
        }
        return (null);
    }
};
