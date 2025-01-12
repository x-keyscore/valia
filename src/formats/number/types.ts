import { TemplateConcretTypes, TemplateCriteria, TemplateGenericTypes, FormatsCriteria } from "../types";

export interface NumberCriteria extends TemplateCriteria<"number"> {
	min?: number;
	max?: number;
	custom?: (input: number) => boolean;
}

export interface NumberConcretTypes extends TemplateConcretTypes<
	NumberCriteria,
	{},
	{}
> {}

type NumberGuard<T extends FormatsCriteria> = T extends NumberCriteria
	? number
	: never;

export interface NumberGenericTypes<T extends FormatsCriteria> extends TemplateGenericTypes<
	NumberCriteria,
	NumberGuard<T>
> {}