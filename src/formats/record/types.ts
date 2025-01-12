import type { TemplateCriteria, TemplateConcretTypes, TemplateGenericTypes,
	FormatsCriteria, FormatsCriteriaMap, FormatsGuard, MountedCriteria } from "../types";

type RecordCriteriaKey = FormatsCriteriaMap["string" | "symbol"];

export interface RecordCriteria extends TemplateCriteria<"record"> {
	min?: number;
	max?: number;
	empty?: boolean;
	key: RecordCriteriaKey;
	value: FormatsCriteria;
}

export interface RecordConcretTypes extends TemplateConcretTypes<
	RecordCriteria,
	{
		empty: boolean;
	},
	{
		key: MountedCriteria<RecordCriteriaKey>;
		value: MountedCriteria<FormatsCriteria>;
	}
> {}

type RecordGuard<T extends FormatsCriteria> =
	T extends RecordCriteria
		? FormatsGuard<T['key']> extends infer K
			? K extends PropertyKey
				? { [P in K]: FormatsGuard<T['value']> }
				: never
			: never
		: never;

export interface RecordGenericTypes<T extends FormatsCriteria> extends TemplateGenericTypes<
	RecordCriteria,
	RecordGuard<T>
> {}