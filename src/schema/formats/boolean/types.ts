import type { SetableCriteriaTemplate, ClassicTypesTemplate, GenericTypesTemplate } from "../types";

export interface BooleanSetableCriteria extends SetableCriteriaTemplate<"boolean"> {}

export interface BooleanClassicTypes extends ClassicTypesTemplate<
	BooleanSetableCriteria,
	{}
> {}

type BooleanGuardedCriteria = boolean;

export interface BooleanGenericTypes<T extends BooleanSetableCriteria> extends GenericTypesTemplate<
	{},
	BooleanGuardedCriteria
> {}