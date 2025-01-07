import type { FormatsCriteria } from "../formats";
import type { MountedCriteria } from "../formats/types";
import { Schema } from "./Schema";

export interface SchemaMountTask {
	definedCriteria: FormatsCriteria;
	mountedCriteria: MountedCriteria<FormatsCriteria>;
}

export interface SchemaCheckTask {
	mountedCriteria: MountedCriteria<FormatsCriteria>;
	value: any;
}

export interface SchemaCheckerResult {
	error: {
		code: string;
		label: string | undefined;
	} | null
}