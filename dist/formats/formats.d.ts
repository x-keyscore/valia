import type { FormatTemplate, VariantCriteria, MountedCriteria } from "./types";
export declare const isMountedSymbol: unique symbol;
export declare function isAlreadyMounted(criteria: VariantCriteria | MountedCriteria<VariantCriteria>): criteria is MountedCriteria<VariantCriteria>;
export declare const defaultGlobalCriteria: {
    [isMountedSymbol]: boolean;
    optional: boolean;
    nullable: boolean;
};
export declare const formats: Record<string, FormatTemplate<VariantCriteria>>;
