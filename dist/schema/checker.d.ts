import type { SchemaReject } from "./types";
import { VariantCriteria, MountedCriteria } from "./formats";
export declare function checker(criteria: MountedCriteria<VariantCriteria>, value: unknown): SchemaReject | null;
