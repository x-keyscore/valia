import type { PathSegments, CheckingTask, CheckingTaskHooks, CheckerReject } from "./types";
import type { MountedCriteria } from "../formats";
import type { SchemaInstance } from "../types";
export declare class CheckingChunk extends Array<CheckingTask> {
    paths: PathSegments;
    constructor(paths: PathSegments);
    addTask(task: {
        data: unknown;
        node: MountedCriteria;
        hooks?: CheckingTaskHooks;
    }): void;
}
export declare function checker(managers: SchemaInstance['managers'], rootNode: MountedCriteria, rootData: unknown): CheckerReject | null;
