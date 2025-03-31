import type { CheckingTask, CheckingChunk, CheckingReject } from "./types";
import type { MountedCriteria } from "../formats";
import type { SchemaInstance } from "../types";
export declare class CheckingStack {
    tasks: CheckingTask[];
    constructor(rootNode: MountedCriteria, rootData: unknown);
    addChunk(sourceTask: CheckingTask, chunk: CheckingChunk): void;
    runHooks(currentTask: CheckingTask, reject: CheckingReject | null): CheckingReject | null;
}
export declare function checker(managers: SchemaInstance['managers'], rootNode: MountedCriteria, rootData: unknown): CheckingReject | null;
