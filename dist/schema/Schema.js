"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Schema = void 0;
exports.isSchemaInstance = isSchemaInstance;
const mounter_1 = require("./mounter");
const checker_1 = require("./checker");
const utils_1 = require("./utils");
class Schema {
    mountedCriteria;
    constructor(definedCriteria) {
        const profiling = (0, utils_1.profiler)();
        this.mountedCriteria = (0, mounter_1.schemaMounter)(definedCriteria);
        const execTime = profiling.end(2);
        console.log(`Schema build - Execution Time: ${execTime} ms`);
        //console.log(definedCriteria);
    }
    checkGuard(value) {
        const { error } = (0, checker_1.schemaChecker)(this.mountedCriteria, value);
        return (!error);
    }
    checkError(value) {
        const { error } = (0, checker_1.schemaChecker)(this.mountedCriteria, value);
        return (error);
    }
}
exports.Schema = Schema;
function isSchemaInstance(x) {
    if (x instanceof Schema)
        return (true);
    return (false);
}
