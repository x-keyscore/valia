import { ConcreteTypesTemplate, VariantCriteriaTemplate, GenericTypesTemplate, VariantCriteria } from "../types";

export interface NumberVariantCriteria extends VariantCriteriaTemplate<"number"> {
	min?: number;
	max?: number;
	custom?: (input: number) => boolean;
}

export interface NumberConcreteTypes extends ConcreteTypesTemplate<
	NumberVariantCriteria,
	{},
	{}
> {}

type NumberGuard<T extends VariantCriteria> = T extends NumberVariantCriteria ? number : never;

export interface NumberGenericTypes<T extends VariantCriteria> extends GenericTypesTemplate<
	NumberVariantCriteria,
	NumberGuard<T>
> {}