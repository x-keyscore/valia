import { TemplateCriteria, TemplateConcretTypes, TemplateGenericTypes, FormatsCriteria } from "../types";

export interface BooleanCriteria extends TemplateCriteria<"boolean"> {}

export interface BooleanConcretTypes extends TemplateConcretTypes<
	BooleanCriteria,
	{},
	{}
> {}

type BooleanGuard<T extends FormatsCriteria> = T extends BooleanCriteria
	? boolean
	: never;

export interface BooleanGenericTypes<T extends FormatsCriteria> extends TemplateGenericTypes<
	BooleanCriteria,
	BooleanGuard<T>
> {}