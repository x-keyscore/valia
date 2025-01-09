"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SymbolFormat = void 0;
const testers_1 = require("../../testers");
const AbstractFormat_1 = require("../AbstractFormat");
class SymbolFormat extends AbstractFormat_1.AbstractFormat {
    constructor() {
        super({});
        this.type = "symbol";
    }
    mountCriteria(definedCriteria, mountedCriteria) {
        return (Object.assign(mountedCriteria, this.baseMountedCriteria, definedCriteria));
    }
    getMountingTasks(definedCriteria, mountedCriteria) {
        return ([]);
    }
    checkEntry(mountedCriteria, entry) {
        const criteria = mountedCriteria;
        if (entry === undefined) {
            return (!criteria.require ? null : "REJECT_TYPE_UNDEFINED");
        }
        else if (!(0, testers_1.isSymbol)(entry)) {
            return "REJECT_TYPE_NOT_SYMBOL";
        }
        return (null);
    }
    getCheckingTasks(mountedCriteria, entry) {
        return ([]);
    }
}
exports.SymbolFormat = SymbolFormat;
