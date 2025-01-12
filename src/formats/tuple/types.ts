import { OmitIndexSignatures } from "../../types";
import { TemplateCriteria, TemplateConcretTypes, TemplateGenericTypes, FormatsCriteria, FormatsGuard, MountedCriteria } from "../types";

interface TupleCriteria extends TemplateCriteria<"tuple"> {
	/** @default false */
	empty?: boolean;
	tuple: [FormatsCriteria, ...FormatsCriteria[]];
}

export interface TupleConcretTypes extends TemplateConcretTypes<
	TupleCriteria,
	{
		empty: boolean;
	},
	{
		tuple: [MountedCriteria<FormatsCriteria>, ...MountedCriteria<FormatsCriteria>[]];
	}
> {}

type TupleGuard<T extends FormatsCriteria> =
	T extends TupleCriteria
		? { [I in keyof T['tuple'] as OmitIndexSignatures<I>]: FormatsGuard<Extract<T['tuple'][I], FormatsCriteria>> }
		: never;

export type TupleGenericTypes<T extends FormatsCriteria> = TemplateGenericTypes<
	TupleCriteria,
	TupleGuard<T>
>