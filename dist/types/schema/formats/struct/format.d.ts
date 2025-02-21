import type { FormatTemplate, MountedCriteria } from "../types";
import type { StructSetableCriteria } from "./types";
interface CustomProperties {
    hasRequiredKeys(mountedCriteria: MountedCriteria<StructSetableCriteria>, value: (string | symbol)[]): boolean;
    hasAcceptedKeys(mountedCriteria: MountedCriteria<StructSetableCriteria>, value: (string | symbol)[]): boolean;
}
export declare const StructFormat: FormatTemplate<StructSetableCriteria, CustomProperties>;
export {};
