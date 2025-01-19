import type { VariantCriteria, MountedCriteria, FormatsGuard } from "./formats";
import { Schema } from "./Schema";

export interface SchemaMountingTask {
	definedCriteria: VariantCriteria;
	mountedCriteria: MountedCriteria<VariantCriteria>;
}

export interface CheckingTaskLink {
	finished: boolean;
	totalLinks: number;
	totalRejected: number;
}

export interface SchemaCheckingTask {
	criteria: MountedCriteria<VariantCriteria>;
	value: unknown;
	link?: CheckingTaskLink;
}

export interface SchemaCheckerReject {
	/** Name of the type that rejected the value */
	type: string;
	/** Path of the type that rejected the value */
	path: string;
	/** `REJECT_<CATEGORY>_<DETAIL>` */
	code: string;
	label: string | undefined;
	message: string | undefined;
};

// TYPE FOR USERS

export type SchemaCheck = SchemaCheckerReject | null;

export type SchemaGuard<T> = T extends Schema<infer U> ? FormatsGuard<U> : never;
	