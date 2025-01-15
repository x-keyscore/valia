import type { VariantCriteria, MountedCriteria } from "../formats";

export interface SchemaMountingTask {
	definedCriteria: VariantCriteria;
	mountedCriteria: MountedCriteria<VariantCriteria>;
}

export interface CheckingTaskLink {
	isClose: boolean;
	totalLinks: number;
	totalRejected: number;
}

export interface SchemaCheckingTask {
	criteria: MountedCriteria<VariantCriteria>;
	value: unknown;
	link?: CheckingTaskLink;
}

export interface SchemaCheckerReject {
	type: string;
	/** `REJECT_<CATEGORY>_<DETAIL>` */
	code: string;
	label: string | undefined;
	message: string | undefined;
};

export type SchemaCheckResult = SchemaCheckerReject | null;