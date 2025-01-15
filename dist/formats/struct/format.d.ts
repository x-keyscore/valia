import type { FormatTemplate, MountedCriteria } from "../types";
import type { StructVariantCriteria } from "./types";
interface CustomProperty {
    hasRequiredKeys(mountedCriteria: MountedCriteria<StructVariantCriteria>, value: Record<string, unknown>): boolean;
    hasDefinedKeys(mountedCriteria: MountedCriteria<StructVariantCriteria>, value: Record<string, unknown>): boolean;
}
export declare const StructFormat: FormatTemplate<StructVariantCriteria, CustomProperty>;
export {};
