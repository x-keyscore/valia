import type { InputSchema, BuildedSchema } from "./types";
import { FormatGuard } from "../formats";
export declare class Schema<DefinedSchema extends InputSchema> {
    readonly defined: DefinedSchema;
    readonly builded: BuildedSchema;
    constructor(inputSchema: DefinedSchema);
    check(input: unknown): input is FormatGuard<DefinedSchema>;
}
