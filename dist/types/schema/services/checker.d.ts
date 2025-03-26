import type { CheckingTask, CheckingHooks, CheckingChunk, CheckingReject } from "./types";
import type { MountedCriteria } from "../formats";
import type { SchemaInstance } from "../types";
export declare class CheckingQueue extends Array<CheckingTask> {
    constructor(rootNode: MountedCriteria, rootData: unknown);
    pushChunk(sourceTask: CheckingTask, chunk: CheckingChunk): void;
    execHooks(code: string | null, listHooks: CheckingHooks[], chunkLength: number): CheckingReject | null;
}
export declare function checker(managers: SchemaInstance['managers'], rootNode: MountedCriteria, rootData: unknown): CheckingReject | null;
