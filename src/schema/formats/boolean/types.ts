import type { SetableCriteriaTemplate, ConcreteTypesTemplate, GenericTypesTemplate } from "../types";

export interface BooleanSetableCriteria extends SetableCriteriaTemplate<"boolean"> {}

export interface BooleanConcreteTypes extends ConcreteTypesTemplate<
	BooleanSetableCriteria,
	{}
> {}

type BooleanGuardedCriteria = boolean;

export interface BooleanGenericTypes<T extends BooleanSetableCriteria> extends GenericTypesTemplate<
	BooleanSetableCriteria,
	{},
	BooleanGuardedCriteria
> {}