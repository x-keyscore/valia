import { FormatsCriteria, MountedCriteria } from "../formats";
import { SchemaCheckReject } from "./types";
export declare function schemaChecker(criteria: MountedCriteria<FormatsCriteria>, entry: unknown): SchemaCheckReject | null;
