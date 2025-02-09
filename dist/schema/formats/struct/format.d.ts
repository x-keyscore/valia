import type { FormatTemplate, MountedCriteria } from "../types";
import type { StructTunableCriteria } from "./types";
interface CustomProperties {
    hasRequiredKeys(mountedCriteria: MountedCriteria<StructTunableCriteria>, value: (string | symbol)[]): boolean;
    hasAcceptedKeys(mountedCriteria: MountedCriteria<StructTunableCriteria>, value: (string | symbol)[]): boolean;
}
export declare const StructFormat: FormatTemplate<StructTunableCriteria, CustomProperties>;
export {};
