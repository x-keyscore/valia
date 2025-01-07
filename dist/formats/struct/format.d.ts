import type { SchemaMountTask, SchemaCheckTask } from "../../schema/types";
import type { FormatCheckValueResult, MountedCriteria } from "../types";
import type { StructCriteria } from "./types";
import { AbstractFormat } from "../AbstractFormat";
export declare class StructFormat<Criteria extends StructCriteria> extends AbstractFormat<Criteria> {
    constructor();
    protected hasRequiredKeys(mountedCriteria: MountedCriteria<Criteria>, value: Record<string, unknown>): boolean;
    protected hasDefinedKeys(mountedCriteria: MountedCriteria<Criteria>, value: Record<string, unknown>): boolean;
    mountCriteria(definedCriteria: Criteria, mountedCriteria: MountedCriteria<Criteria>): MountedCriteria<Criteria>;
    getMountingTasks(definedCriteria: Criteria, mountedCriteria: MountedCriteria<Criteria>): SchemaMountTask[];
    objectLength(obj: object): number;
    checkValue(mountedCriteria: MountedCriteria<Criteria>, value: unknown): FormatCheckValueResult;
    getCheckingTasks(mountedCriteria: MountedCriteria<Criteria>, value: any): SchemaCheckTask[];
}
