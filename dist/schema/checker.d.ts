import type { SchemaCheckerReject } from "./types";
import { VariantCriteria, MountedCriteria } from "./formats";
export declare function checker(criteria: MountedCriteria<VariantCriteria>, value: unknown): SchemaCheckerReject | null;
