import { VariantCriteria, MountedCriteria } from "../formats";
export declare const metadataSymbol: unique symbol;
export declare function mounter<T extends VariantCriteria>(definedCriteria: T): MountedCriteria<T>;
export declare function isMountedCriteria(criteria: object): criteria is MountedCriteria<VariantCriteria>;
