import type { SetableCriteria, MountedCriteria } from "../formats";
import type { EventsManager, RegistryManager } from "../managers";
export declare const metadataSymbol: unique symbol;
export declare function isMountedCriteria(obj: object): obj is MountedCriteria;
export declare function mounter<T extends SetableCriteria>(registryManager: RegistryManager, eventsManager: EventsManager, clonedCriteria: SetableCriteria & T): MountedCriteria<T>;
