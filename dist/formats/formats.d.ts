import type { FormatTemplate, VariantCriteria, MountedCriteria } from "./types";
export declare const mountedMarkerSymbol: unique symbol;
export declare function isMountedCriteria(criteria: object): criteria is MountedCriteria<VariantCriteria>;
export declare const formatDefaultCriteria: {
    optional: boolean;
    nullable: boolean;
};
export declare const formats: Record<string, FormatTemplate<VariantCriteria>>;
