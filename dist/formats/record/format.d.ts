import type { SchemaMountTask, SchemaCheckTask } from "../../schema/types";
import type { FormatCheckValueResult, MountedCriteria } from "../types";
import type { RecordCriteria } from "./types";
import { AbstractFormat } from "../AbstractFormat";
export declare class RecordFormat<Criteria extends RecordCriteria> extends AbstractFormat<Criteria> {
    constructor();
    mountCriteria(definedCriteria: Criteria, mountedCriteria: MountedCriteria<Criteria>): MountedCriteria<Criteria>;
    getMountingTasks(definedCriteria: Criteria, mountedCriteria: MountedCriteria<Criteria>): SchemaMountTask[];
    objectLength(obj: object): number;
    checkValue(mountedCriteria: MountedCriteria<Criteria>, value: unknown): FormatCheckValueResult;
    getCheckingTasks(mountedCriteria: MountedCriteria<Criteria>, value: any): SchemaCheckTask[];
}
