import type { FormatCheckerResult, FormatsCriteria, PredefinedCriteria } from "./types";
export declare abstract class AbstractFormat<DefinedCriteria extends FormatsCriteria> {
    protected abstract readonly predefinedCriteria: PredefinedCriteria<DefinedCriteria>;
    protected readonly definedCriteria: DefinedCriteria;
    constructor(definedCriteria: DefinedCriteria);
    get criteria(): {
        require: boolean;
    } & import("./types").FormatsContextByCriteria<DefinedCriteria>["predefinedCriteria"] & DefinedCriteria;
    abstract checker(src: unknown): FormatCheckerResult;
}
