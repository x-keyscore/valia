import type { FormatsCriteria, FormatsGuard, MountedCriteria } from "../formats";
import type { SchemaInstance } from "./types";
export declare class Schema<DefinedCriteria extends FormatsCriteria> {
    readonly mountedCriteria: MountedCriteria<DefinedCriteria>;
    constructor(definedCriteria: DefinedCriteria);
    checkGuard(value: unknown): value is FormatsGuard<DefinedCriteria>;
    checkError(value: unknown): {
        code: string;
        label: string | undefined;
    } | null;
}
export declare function isSchemaInstance(x: unknown): x is SchemaInstance;
