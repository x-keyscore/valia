import { FormatsCriteria, FormatsGuard, TemplateCriteria, TemplateContext, MountedCriteria } from "../types";

export interface ArrayCriteria extends TemplateCriteria<"array"> {
	item: FormatsCriteria;
	min?: number;
	max?: number;
	/**
	 * @default true
	 */
	empty?: boolean;
}

type ArrayGuard<T extends FormatsCriteria> = T extends ArrayCriteria
	? FormatsGuard<T['item']>[]
	: never;

export type ArrayContext<T extends FormatsCriteria> = TemplateContext<
	ArrayCriteria,
	ArrayGuard<T>,
	{
		empty: boolean
	},
	{
		item: MountedCriteria<ArrayCriteria>
	}
>