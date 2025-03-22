import type { SetableCriteria, MountedCriteria } from "../formats";
import type { PathSegments, MountingTask } from "./types";
import type { SchemaInstance } from "../types";
export declare const nodeSymbol: unique symbol;
export declare function hasNodeSymbol(obj: object): obj is MountedCriteria;
export declare class MountingChunk extends Array<MountingTask> {
    paths: PathSegments;
    constructor(paths: PathSegments);
    add(task: {
        node: SetableCriteria | MountedCriteria;
        partPaths: PathSegments;
    }): void;
}
export declare function mounter<T extends SetableCriteria>(managers: SchemaInstance['managers'], rootNode: SetableCriteria & T): MountedCriteria<T>;
