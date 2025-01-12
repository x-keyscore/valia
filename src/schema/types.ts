import type { FormatsCriteria, MountedCriteria } from "../formats";

export interface SchemaMountingTask {
	definedCriteria: FormatsCriteria;
	mountedCriteria: MountedCriteria<FormatsCriteria>;
}

export interface SchemaCheckingTask {
	criteria: MountedCriteria<FormatsCriteria>;
	/** value root or value subpart */
	value: any;
}

export interface SchemaCheckerReject {
	type: string;
	/** `REJECT_<CATEGORY>_<DETAIL>` */
	code: string;
	label: string | undefined;
	message: string | undefined;
};

export type SchemaCheckResult = SchemaCheckerReject | null;