import { ConcreteTypesTemplate, VariantCriteriaTemplate, GenericTypesTemplate, VariantCriteria } from "../types";

export interface NumberVariantCriteria extends VariantCriteriaTemplate<"number"> {
	min?: number;
	max?: number;
	enum?: number[] | Record<string, number>;
	custom?: (input: number) => boolean;
}

export interface NumberConcreteTypes extends ConcreteTypesTemplate<
	NumberVariantCriteria,
	{},
	{}
> {}

type NumberGuard<T extends VariantCriteria> = 
	T extends NumberVariantCriteria 
		? T['enum'] extends number[]
			? T['enum'][number]
			: T['enum'] extends Record<string, number>
				? { [K in keyof T['enum']]: T['enum'][K] }[keyof T['enum']]
				: number
		: never;

export interface NumberGenericTypes<T extends VariantCriteria> extends GenericTypesTemplate<
	NumberVariantCriteria,
	NumberGuard<T>
> {}