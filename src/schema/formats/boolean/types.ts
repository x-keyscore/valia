import { TunableCriteriaTemplate, ConcreteTypesTemplate, GenericTypesTemplate, TunableCriteria } from "../types";

export interface BooleanTunableCriteria extends TunableCriteriaTemplate<"boolean"> {}

export interface BooleanConcreteTypes extends ConcreteTypesTemplate<
	BooleanTunableCriteria,
	{}
> {}

type BooleanGuardedCriteria = boolean;

export interface BooleanGenericTypes<T extends BooleanTunableCriteria> extends GenericTypesTemplate<
	BooleanTunableCriteria,
	{},
	BooleanGuardedCriteria
> {}