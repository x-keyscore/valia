import type { SchemaMountTask, SchemaCheckTask } from "../../schema/types";
import type { FormatCheckEntry, MountedCriteria } from "../types";
import type { StructCriteria } from "./types";
import { AbstractFormat } from "../AbstractFormat";
export declare class StructFormat<Criteria extends StructCriteria> extends AbstractFormat<Criteria> {
    type: Criteria["type"];
    constructor();
    protected hasRequiredKeys(mountedCriteria: MountedCriteria<Criteria>, value: Record<string, unknown>): boolean;
    protected hasDefinedKeys(mountedCriteria: MountedCriteria<Criteria>, value: Record<string, unknown>): boolean;
    mountCriteria(definedCriteria: Criteria, mountedCriteria: MountedCriteria<Criteria>): MountedCriteria<Criteria>;
    getMountingTasks(definedCriteria: Criteria, mountedCriteria: MountedCriteria<Criteria>): SchemaMountTask[];
    checkEntry(mountedCriteria: MountedCriteria<Criteria>, entry: unknown): FormatCheckEntry;
    getCheckingTasks(criteria: MountedCriteria<Criteria>, entry: any): SchemaCheckTask[];
}
