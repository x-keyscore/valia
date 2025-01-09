import type { SchemaCheckTask, SchemaMountTask } from "../../schema/types";
import type { FormatCheckEntry, MountedCriteria } from "../types";
import type { SymbolCriteria } from "./types";
import { AbstractFormat } from "../AbstractFormat";
export declare class SymbolFormat<Criteria extends SymbolCriteria> extends AbstractFormat<Criteria> {
    type: Criteria["type"];
    constructor();
    mountCriteria(definedCriteria: Criteria, mountedCriteria: MountedCriteria<Criteria>): MountedCriteria<Criteria>;
    getMountingTasks(definedCriteria: Criteria, mountedCriteria: MountedCriteria<Criteria>): SchemaMountTask[];
    checkEntry(mountedCriteria: MountedCriteria<Criteria>, entry: unknown): FormatCheckEntry;
    getCheckingTasks(mountedCriteria: MountedCriteria<Criteria>, entry: any): SchemaCheckTask[];
}
