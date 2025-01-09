import { SchemaMountTask, SchemaCheckTask } from "../schema/types";
import type { FormatsCriteria, MountedCriteria, PredefinedCriteria, FormatCheckEntry } from "./types";
export declare const isMountedSymbol: unique symbol;
export declare function isAlreadyMounted(criteria: object): criteria is MountedCriteria<FormatsCriteria>;
export declare const globalCriteria: {
    require: boolean;
};
export declare abstract class AbstractFormat<Criteria extends FormatsCriteria> {
    abstract readonly type: Criteria['type'];
    protected readonly baseMountedCriteria: typeof globalCriteria & PredefinedCriteria<Criteria>;
    constructor(predefinedCriteria: PredefinedCriteria<Criteria>);
    abstract mountCriteria(definedCriteria: Criteria, mountedCriteria: MountedCriteria<Criteria>): MountedCriteria<Criteria>;
    abstract getMountingTasks(definedCriteria: Criteria, mountedCriteria: MountedCriteria<Criteria>): SchemaMountTask[];
    abstract checkEntry(criteria: MountedCriteria<Criteria>, entry: unknown): FormatCheckEntry;
    abstract getCheckingTasks(criteria: MountedCriteria<Criteria>, entry: any): SchemaCheckTask[];
}
