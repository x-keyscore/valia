import type { TemplateCriteria, TemplateConcretTypes, TemplateGenericTypes, FormatsCriteria, FormatsGuard, MountedCriteria } from "../types";
import type { OmitIndexSignatures } from "../../types";

interface StructCriteria extends TemplateCriteria<"struct"> {
	/** @default false */
	empty?: boolean;
	/**
	 * Possible values:
	 * - `"Y"`: Yes
	 * - `"N"`: No
	 * - `"D"`: Dependent (depends on the `require` parameter of the criteria for the value of the key)
	 * 
	 * @default "N"
	 */
	optionalKeys?: "Y" | "N" | "R";
	struct: Record<PropertyKey, FormatsCriteria>;
}

export interface StructConcretTypes extends TemplateConcretTypes<
	StructCriteria,
	{
		empty: boolean;
	},
	{
		definedKeys: string[];
		requiredKeys: string[];
		struct: Record<PropertyKey, MountedCriteria<FormatsCriteria>>;
	}
> {}
/*
type NotRequireKeyMap<T extends StructCriteria['struct']> = {
	[P in keyof T]-?: T[P]['require'] extends false ? P : never
}[keyof T];

type NotRequireKeyToOptional<T extends StructCriteria['struct']> =
	Partial<Pick<T, NotRequireKeyMap<T>>> &
	Pick<T, Exclude<keyof T, NotRequireKeyMap<T>>>;
*/
// NotRequireKeyToOptional<T['struct']>

type StructGuard<T extends FormatsCriteria> =
	T extends StructCriteria
		? T['optionalKeys'] extends "Y" ? { [K in keyof T['struct'] as OmitIndexSignatures<K>]?: FormatsGuard<T['struct'][K]> }
			: { [K in keyof T['struct'] as OmitIndexSignatures<K>]: FormatsGuard<T['struct'][K]> }
		: never;

export interface StructGenericTypes<T extends FormatsCriteria> extends TemplateGenericTypes<
	StructCriteria,
	StructGuard<T>
> {}