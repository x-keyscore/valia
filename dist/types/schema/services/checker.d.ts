import type { CheckingTask, CheckerReject, CheckingTaskCallbacks } from "./types";
import type { MountedCriteria } from "../formats";
import type { SchemaInstance } from "../types";
export declare class CheckingChunk extends Array<CheckingTask> {
    queue: CheckingTask[];
    owner: CheckingTask;
    constructor(queue: CheckingTask[], owner: CheckingTask);
    addTask(task: {
        data: unknown;
        node: MountedCriteria;
        hooks?: CheckingTaskCallbacks;
    }): void;
}
export declare function checker(managers: SchemaInstance['managers'], rootNode: MountedCriteria, rootData: unknown): CheckerReject | null;
