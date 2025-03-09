import type { SetableCriteriaTemplate, ClassicTypesTemplate, GenericTypesTemplate } from "../types";

export interface BooleanSetableCriteria extends SetableCriteriaTemplate<"boolean"> {}

export interface BooleanClassicTypes extends ClassicTypesTemplate<
	BooleanSetableCriteria,
	{}
> {}

export interface BooleanGenericTypes extends GenericTypesTemplate<
	{},
	boolean
> {}