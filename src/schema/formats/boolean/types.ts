import { VariantCriteriaTemplate, ConcreteTypesTemplate, GenericTypesTemplate, VariantCriteria } from "../types";

export interface BooleanVariantCriteria extends VariantCriteriaTemplate<"boolean"> {}

export interface BooleanConcreteTypes extends ConcreteTypesTemplate<
	BooleanVariantCriteria,
	{},
	{}
> {}

type BooleanGuard<T extends VariantCriteria> = T extends BooleanVariantCriteria ? boolean : never;

export interface BooleanGenericTypes<T extends VariantCriteria> extends GenericTypesTemplate<
	BooleanVariantCriteria,
	BooleanGuard<T>
> {}