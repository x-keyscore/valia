import type { TunableCriteria, MountedCriteria } from "../formats";
import { MapperInstance } from "../handlers";
export declare function mounter<T extends TunableCriteria>(mapper: MapperInstance, definedCriteria: T): MountedCriteria<T>;
export declare function isMountedCriteria(obj: object): obj is MountedCriteria<TunableCriteria>;
