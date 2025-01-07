import type { FormatsCriteria, FormatsGuard, MountedCriteria, TemplateContext, TemplateCriteria } from "../types";

export interface StructCriteria extends TemplateCriteria<"struct"> {
	empty?: boolean;
	struct: Record<PropertyKey, FormatsCriteria>;
}

type NotRequireKeyMap<T extends StructCriteria['struct']> = {
	[P in keyof T]-?: T[P]['require'] extends false ? P : never
}[keyof T];

type NotRequireToOptional<T extends StructCriteria['struct']> =
	Partial<Pick<T, NotRequireKeyMap<T>>> &
	Pick<T, Exclude<keyof T, NotRequireKeyMap<T>>>;

type StructGuard<T extends FormatsCriteria> =
	T extends StructCriteria
		? { [K in keyof NotRequireToOptional<T['struct']>]: FormatsGuard<T['struct'][K]> }
		: never;

export type StructContext<T extends FormatsCriteria> = TemplateContext<
	StructCriteria,
	StructGuard<T>,
	{
		empty: boolean;
	},
	{
		struct: Record<PropertyKey, MountedCriteria<FormatsCriteria>>;
		definedKeys: string[];
		requiredKeys: string[];
	}
>