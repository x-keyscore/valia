import type { SetableCriteria, MountedCriteria } from "../formats";
import type { SchemaInstance } from "../types";
export declare const metadataSymbol: unique symbol;
export declare function isMountedCriteria(obj: object): obj is MountedCriteria;
export declare function mounter<T extends SetableCriteria>(managers: SchemaInstance['managers'], criteria: SetableCriteria & T): MountedCriteria<T>;
