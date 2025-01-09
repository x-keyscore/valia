import { FormatsCriteria, FormatsGuard, TemplateCriteria, TemplateContext, MountedCriteria } from "../types";

export interface TupleCriteria extends TemplateCriteria {
	type: "tuple";
	min?: number;
	max?: number;
	/**
	 * @default true
	 */
	empty?: boolean;
	tuple: [FormatsCriteria, ...FormatsCriteria[]];
}

type TupleGuard<T extends FormatsCriteria> = T extends TupleCriteria
	? { [Index in keyof T['tuple']]: FormatsGuard<Extract<T['tuple'][Index], FormatsCriteria>> }
	: never;

export type TupleContext<T extends FormatsCriteria> = TemplateContext<
	TupleCriteria,
	TupleGuard<T>,
	{
		empty: boolean;
	},
	{
		tuple: [MountedCriteria<TupleCriteria>, ...MountedCriteria<TupleCriteria>[]]
	}
>