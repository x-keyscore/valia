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

export interface SchemaReject {
	/** `REJECT_<CATEGORY>_<DETAIL>` */
	code: string;
	type: string;
	path: string;
	label: string | undefined;
	message: string | undefined;
};

export type SchemaInfer<T> = T extends Schema<infer U> ? FormatsGuard<U> : never;

export type CriteriaInfer<T> = T extends VariantCriteria ? FormatsGuard<T> : never;
	