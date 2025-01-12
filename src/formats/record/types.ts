import type { GlobalCriteria, FormatsCriteria, FormatsCriteriaMap, FormatsGuard, MountedCriteria } from "../types";

type FormatName = "record";

type RecordCriteriaKey = FormatsCriteriaMap["string" | "number" | "symbol"];

export interface RecordCriteria extends GlobalCriteria {
	type: FormatName;
	min?: number;
	max?: number;
	empty?: boolean;
	key: RecordCriteriaKey;
	value: FormatsCriteria;
}

type DefaultRecordCriteria = {
	empty: boolean;
}

type MountedRecordCriteria = {
	key: MountedCriteria<RecordCriteriaKey>;
	value: MountedCriteria<FormatsCriteria>;
}

export type RecordConcretTypes = {
	type: FormatName;
	criteria: RecordCriteria;
	defaultCriteria: DefaultRecordCriteria;
	mountedCritetia: MountedRecordCriteria;
}

type RecordGuard<T extends FormatsCriteria> =
	T extends RecordCriteria
		? FormatsGuard<T['key']> extends infer K
			? K extends PropertyKey
				? { [P in K]: FormatsGuard<T['value']> }
				: never
			: never
		: never;

export type RecordGenericTypes<T extends FormatsCriteria> = {
	type: FormatName;
	guard: RecordGuard<T>;
}