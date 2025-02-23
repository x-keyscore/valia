import type { Reject } from "./types";
import type { MountedCriteria } from "../formats";
import type { SchemaInstance } from "../types";
export declare function checker(managers: SchemaInstance['managers'], criteria: MountedCriteria, value: unknown): Reject | null;
