import type { Format, MountedCriteria } from "../types";
import type { StructSetableCriteria } from "./types";
export interface CustomProperties {
    hasRequiredKeys(mountedCriteria: MountedCriteria<StructSetableCriteria>, value: (string | symbol)[]): boolean;
    hasAcceptedKeys(mountedCriteria: MountedCriteria<StructSetableCriteria>, value: (string | symbol)[]): boolean;
}
export declare const StructFormat: Format<StructSetableCriteria, CustomProperties>;
