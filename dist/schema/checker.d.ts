import { VariantCriteria, MountedCriteria } from "../formats";
import { SchemaCheckerReject } from "./types";
export declare function checker(criteria: MountedCriteria<VariantCriteria>, value: unknown): SchemaCheckerReject | null;
