import { SchemaMountTask, SchemaCheckTask } from "../schema/types";
import type { FormatsCriteria, MountedCriteria, PredefinedCriteria, FormatCheckValueResult } from "./types";
export declare const defaultCriteria: {
    require: boolean;
};
export declare abstract class AbstractFormat<Criteria extends FormatsCriteria> {
    protected readonly baseCriteria: typeof defaultCriteria & PredefinedCriteria<Criteria>;
    constructor(predefinedCriteria: PredefinedCriteria<Criteria>);
    abstract mountCriteria(definedCriteria: Criteria, mountedCriteria: MountedCriteria<Criteria>): MountedCriteria<Criteria>;
    abstract getMountingTasks(definedCriteria: Criteria, mountedCriteria: MountedCriteria<Criteria>): SchemaMountTask[];
    abstract checkValue(mountedCriteria: MountedCriteria<Criteria>, value: unknown): FormatCheckValueResult;
    abstract getCheckingTasks(mountedCriteria: MountedCriteria<Criteria>, value: any): SchemaCheckTask[];
}
