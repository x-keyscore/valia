import type { SetableCriteria, MountedCriteria } from "../formats";
import type { MountingTask, MountingChunk } from "./types";
import type { SchemaInstance } from "../types";
export declare const nodeSymbol: unique symbol;
export declare function hasNodeSymbol(obj: object): obj is MountedCriteria;
export declare class MountingStack extends Array<MountingTask> {
    constructor(rootNode: SetableCriteria | MountedCriteria);
    addChunk(owner: MountingTask, chunk: MountingChunk): void;
}
export declare function mounter<T extends SetableCriteria>(managers: SchemaInstance['managers'], rootNode: SetableCriteria & T): MountedCriteria<T>;
