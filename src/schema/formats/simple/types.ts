import type { SetableCriteriaTemplate, ClassicTypesTemplate, GenericTypesTemplate } from "../types";

export type SimpleTypes =
	| "undefined"
	| "unknown"
	| "nullish"
	| "null"
	| "any";

export interface SimpleSetableCriteria extends SetableCriteriaTemplate<"simple"> {
	simple: SimpleTypes;
}

export interface OmegaClassicTypes extends ClassicTypesTemplate<
	SimpleSetableCriteria,
	{}
> {}

export interface SimpleMountedCriteria {
	bitcode: number;
}

type SimpleGuardedCriteria<T extends SimpleSetableCriteria> = 
    T["simple"] extends "undefined"   ? undefined :
    T["simple"] extends "unknown"     ? unknown :
    T["simple"] extends "nullish"     ? null | undefined :
    T["simple"] extends "null"        ? null :
    T["simple"] extends "any"         ? any :
    never;

export interface SimpleGenericTypes<T extends SimpleSetableCriteria> extends GenericTypesTemplate<
	SimpleMountedCriteria,
	SimpleGuardedCriteria<T>
> {}