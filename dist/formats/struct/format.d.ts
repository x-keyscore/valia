import type { FormatTemplate, MountedCriteria } from "../types";
import type { StructVariantCriteria } from "./types";
interface CustomProperties {
    hasRequiredKeys(mountedCriteria: MountedCriteria<StructVariantCriteria>, value: (string | symbol)[]): boolean;
    hasValidKeys(mountedCriteria: MountedCriteria<StructVariantCriteria>, value: (string | symbol)[]): boolean;
}
export declare const StructFormat: FormatTemplate<StructVariantCriteria, CustomProperties>;
export {};
