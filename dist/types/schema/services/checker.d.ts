import type { Rejection } from "./types";
import type { MountedCriteria } from "../formats";
import type { SchemaInstance } from "../types";
export declare function checker(managers: SchemaInstance['managers'], criteria: MountedCriteria, value: unknown): Rejection | null;
