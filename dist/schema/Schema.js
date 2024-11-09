"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Schema = void 0;
const builder_1 = require("./builder");
const checker_1 = require("./checker");
class Schema {
    defined;
    builded;
    /*
    If the type defined on "inputSchema" is "InputSchema"
    instead of type "InputSchema", this is to enable strong
    typing when defining the schema in the constructor.
    This also displays comments defined on the criteria.
    */
    constructor(inputSchema) {
        this.defined = inputSchema;
        const start = performance.now();
        this.builded = (0, builder_1.schemaBuilder)(inputSchema);
        const end = performance.now();
        const timeTaken = end - start;
        console.log(`Execution Time: ${timeTaken.toFixed(2)} ms`);
        console.log(this.builded);
    }
    check(input) {
        const result = (0, checker_1.schemaChecker)(input, this.builded);
        console.log(result);
        return (!result.error);
    }
}
exports.Schema = Schema;
